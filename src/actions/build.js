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
import { TemplateTypes, GLOBALSCRIPTSPATH } from '../utils/constants';
import { Config } from './config';
import { FileHelper } from '../utils/fileHelper';
import { ConfigValidator } from '../utils/configValidator';
import { Message } from '../utils/message';
import { Package } from '../models/package';
import { Text } from '../utils/texts';
export class Builder {
  constructor() {}
  static start() {
    Message.info(Text.buildStart);
    const configObject = Config.start();
    Message.info(Text.buildValidationStart);
    if (!ConfigValidator.validate(configObject)) {
      Message.error(Text.buildValidationError);
      Message.reset();
      return;
    }
    Message.info(Text.buildCleanDist);
    FileHelper.clearDistFolder();
    Message.info(Text.buildCreateFiles);
    this.createAndWriteTemplateFiles(configObject);
    Message.info(Text.buildCreateFilesComplete);
    Message.info(Text.createGlobalScripts);
    this.createGlobalScripts();
    Message.info(Text.createGlobalScriptsComplete);
    Message.info(Text.buildCreateCDN);
    this.cdnPackage();
    Message.info(Text.buildCreateCDNComplete);
    Message.info(Text.buildPackageInfo);
    this.createPackageInfo(configObject);
    Message.info(Text.buildPackageInfoComplete);
    Message.info(Text.buildCreateDesignZip);
    FileHelper.buildCloudeeZip();
    Message.info(Text.buildComplete);
  }

  static createAndWriteTemplateFiles(configObject) {
    FileHelper.existsTemplatePathCreateIfNot();
    Object.keys(TemplateTypes).forEach((key) => {
      const templateType = TemplateTypes[key];
      const templateFiles = FileHelper.readFiles(templateType.path);
      let count = 0;
      templateFiles.forEach((templateFile) => {
        const template = FileHelper.createTemplateFromFile(templateFile, templateType);
        const configTemplateFile = configObject[templateType.config].filter((configTemplate) => {
          return configTemplate.okey === template.okey;
        })[0];
        template.title = configTemplateFile.title;
        template.descr = configTemplateFile.descr;
        template.id = configTemplateFile.id;
        template.custFields = configTemplateFile.custFields.filter((custField) => {
          return !custField.ignore;
        });
        FileHelper.addSelectValues(template.custFields);
        FileHelper.writeCloudeeFile(template);
        count++;
      });
      Message.info(Text.parse(Text.buildTemplateInfo, count, templateType.type));
    });
  }
  static cdnPackage() {
    FileHelper.writeCDNFiles();
  }
  static createPackageInfo(configObject) {
    const packageJson = new Package(configObject);
    FileHelper.writePackageToDist(packageJson);
  }
  static createGlobalScripts() {
    const scripts = [];
    const scriptFiles = FileHelper.readFiles(GLOBALSCRIPTSPATH);
    scriptFiles.forEach((scriptFile) => {
      scripts.push(FileHelper.createGlobalScriptFromFile(scriptFile));
    });
    FileHelper.writeGlobalScriptFile(scripts);
  }
}
