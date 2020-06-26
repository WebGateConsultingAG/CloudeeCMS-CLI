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
import { Utils } from '../utils/utils';
export class Config {
  constructor() {}
  static start() {
    let config = this.getBaseContent();
    Object.keys(TemplateTypes).forEach((key) => {
      const templateType = TemplateTypes[key];
      config[templateType.config] = this.updateConfigTemplates(config, templateType);
    });
    this.writeConfig(config);
    return config;
  }
  static writeConfig(config) {
    fs.writeFileSync(CONFIGPATH, yaml.safeDump(config), CHARSET);
  }

  static updateConfigTemplates(config, templateType) {
    const templateConfigurations = config[templateType.config];
    const templateFiles = FileHelper.readFiles(templateType.path);
    const keys = [];
    templateFiles.forEach((templateFile) => {
      const template = FileHelper.createTemplateFromFile(templateFile, templateType);
      delete template.body;
      keys.push(template.okey);
      const templateConfigArr = templateConfigurations.filter((templateConfig) => {
        return templateConfig.okey === template.okey;
      });
      if (templateConfigArr && templateConfigArr.length > 0) {
        const templateConfig = templateConfigArr[0];
        this.chkAndAddFields(config, templateConfig, template.custFields);
      } else {
        const templateConfig = new TemplateConfig();
        templateConfig.okey = template.okey;
        templateConfig.descr = null;
        templateConfig.custFields = template.custFields;
        templateConfig.id = templateType.prefix + uuidv4();
        templateConfig.title = null;
        templateConfigurations.push(templateConfig);
      }
    });
    return !templateConfigurations
      ? []
      : templateConfigurations.filter((template) => {
          return keys.includes(template.okey);
        });
  }

  static chkAndAddFields(config, templateConfig, foundFields) {
    let fields = templateConfig.custFields;
    if (!fields) {
      fields = [];
    }
    foundFields.forEach((foundField) => {
      if (!this.isSystemField(config, foundField.fldName)) {
        const existingFieldArr = fields.filter((configField) => {
          return (
            configField.fldName === foundField.fldName ||
            (foundField.fldName.indexOf('doc.') === 0 && foundField.fldName.substr(4) === configField.fldName)
          );
        });
        if (!existingFieldArr || existingFieldArr.length === 0) {
          if (!Utils.fieldExist(fields, foundField)) {
            fields.push(foundField);
          }
        }
      }
    });
    this.checkForDropDown(fields);
    this.checkForContainer(fields);
    templateConfig.custFields = fields;
  }

  static checkForDropDown(fields) {
    fields.forEach((field) => {
      if (field.fldType === FieldTypes.DROPDOWN && !field.selectValueFile) {
        field.selectValueFile = null;
      }
    });
  }

  static checkForContainer(fields) {
    fields.forEach((field) => {
      if (field.fldType === FieldTypes.CONTAINER && !field.restrictChilds) {
        field.restrictChilds = false;
        field.accepts = [];
      }
    });
  }

  static isSystemField(config, fieldName) {
    return (
      SYSTEM_FIELDNAMES.includes(fieldName) ||
      fieldName.indexOf('env.') === 0 ||
      (config.customVariables && config.customVariables.some((customVariable) => fieldName.indexOf(customVariable) === 0))
    );
  }

  static getBaseContent() {
    let data = {
      title: 'Your template title',
      description: 'Your template description',
      customVariables: [],
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
