/*
 * Copyright WebGate Consulting AG, 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */
import fs from 'fs';
import yaml from 'js-yaml';
import { CHARSET, CONFIGPATH, TemplateTypes, FieldTypes, SYSTEM_FIELDNAMES } from '../utils/constants';
import { FileHelper } from '../utils/fileHelper';
import { TemplateConfig } from '../models/TemplateConfig';
import { v4 as uuidv4 } from 'uuid';
export class Config {
  constructor() {}
  static start() {
    let data = this.getBaseContent();
    Object.keys(TemplateTypes).forEach((key) => {
      const templateType = TemplateTypes[key];
      data[templateType.config] = this.updateConfigTemplates(data[templateType.config], templateType);
    });
    this.writeConfig(data);
    return data;
  }
  static writeConfig(data) {
    fs.writeFileSync(CONFIGPATH, yaml.safeDump(data), CHARSET);
  }
  static updateConfigTemplates(templateConfigs, templateType) {
    const templateFiles = FileHelper.readFiles(templateType.path);
    const keys = [];
    templateFiles.forEach((templateFile) => {
      const template = FileHelper.createTemplateFromFile(templateFile, templateType);
      delete template.body;
      keys.push(template.okey);
      const templateConfigArr = templateConfigs.filter((templateConfig) => {
        return templateConfig.okey === template.okey;
      });
      if (templateConfigArr && templateConfigArr.length > 0) {
        const templateConfig = templateConfigArr[0];
        this.chkAndAddFields(templateConfig, template.custFields);
      } else {
        const templateConfig = new TemplateConfig();
        templateConfig.okey = template.okey;
        templateConfig.descr = null;
        templateConfig.custFields = template.custFields;
        templateConfig.id = templateType.prefix + uuidv4();
        templateConfig.title = null;
        templateConfigs.push(templateConfig);
      }
    });
    return templateConfigs.filter((template) => {
      return keys.includes(template.okey);
    });
  }

  static chkAndAddFields(templateConfig, foundFields) {
    let fields = templateConfig.custFields;
    if (!fields) {
      fields = [];
    }
    foundFields.forEach((foundField) => {
      if (!this.isSystemField(foundField.fldName)) {
        const existingFieldArr = fields.filter((configField) => {
          return (
            configField.fldName === foundField.fldName ||
            (foundField.fldName.indexOf('doc.') === 0 && foundField.fldName.substr(4) === configField.fldName)
          );
        });
        if (!existingFieldArr || existingFieldArr.length === 0) {
          if (!FileHelper.fieldExist(fields, foundField)) {
            fields.push(foundField);
          }
        }
      }
    });

    fields.forEach((field) => {
      if (field.fldType === FieldTypes.DROPDOWN && !field.selectValueFile) {
        field.selectValueFile = null;
      }
    });
    templateConfig.custFields = fields;
  }

  static isSystemField(fieldName) {
    return SYSTEM_FIELDNAMES.includes(fieldName);
  }

  static getBaseContent() {
    let data = {
      title: 'Cloudee Design',
      description: 'CloudeeCMS Standard Design',
      layouts: [],
      layoutBlocks: [],
      microTemplates: [],
      forms: [],
      environmentVariables: [],
    };
    if (fs.existsSync(CONFIGPATH)) {
      const fileContents = fs.readFileSync(CONFIGPATH, CHARSET);
      data = yaml.safeLoad(fileContents);
    }
    return data;
  }
}
