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
import { TemplateConfig } from '../models/templateConfig';
import { v4 as uuidv4 } from 'uuid';
import { Utils } from '../utils/utils';
import { Message } from '../utils/message';
import { Text } from '../utils/texts';
import { EnvironmentVariable } from '../models/environmentVariable';
export class Config {
  constructor() {}
  static start() {
    Message.info(Text.configStart);
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
        this.chkAndAddFields(config, templateConfig, template.custFields);
        templateConfig.okey = template.okey;
        templateConfig.descr = null;
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
      if (
        !this.isSystemField(foundField.fldName) &&
        !this.isEnvField(foundField.fldName) &&
        !this.isCustomField(config, foundField.fldName)
      ) {
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
      } else {
        this.writeEnvVariables(config, foundField.fldName);
      }
    });
    this.checkForDropDown(fields);
    this.checkForContainer(fields);
    templateConfig.custFields = fields;
  }

  static writeEnvVariables(config, fldName) {
    if (!this.isSystemField(fldName) && this.isEnvField(fldName)) {
      if (!config.environmentVariables.some((envVar) => envVar.variablename === fldName)) {
        config.environmentVariables.push(EnvironmentVariable.createEnvironmentVariable(fldName));
      }
    }
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

  static isSystemField(fieldName) {
    return SYSTEM_FIELDNAMES.includes(fieldName);
  }

  static isEnvField(fieldName) {
    return fieldName.indexOf('env.') === 0;
  }

  static isCustomField(config, fieldName) {
    return config.customVariables && config.customVariables.some((customVariable) => fieldName.indexOf(customVariable) === 0);
  }

  static getBaseContent() {
    let data = {
      title: 'Your template title',
      description: 'Your template description',
      author: 'your name',
      license: '',
      designZipFileName: 'design',
      compressCSS: true,
      compressJS: true,
      customVariables: [],
      layouts: [],
      layoutBlocks: [],
      microTemplates: [],
      forms: [],
      environmentVariables: [],
    };
    if (fs.existsSync(CONFIGPATH)) {
      const fileContents = fs.readFileSync(CONFIGPATH, CHARSET);
      let existingData = yaml.safeLoad(fileContents);
      Object.keys(data).forEach((key) => {
        if (!existingData[key]) {
          existingData[key] = data[key];
        }
      });
      return existingData;
    }
    return data;
  }
}
