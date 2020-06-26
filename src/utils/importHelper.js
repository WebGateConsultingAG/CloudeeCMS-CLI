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
import { Config } from '../actions/config';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { CHARSET, CDNPATH } from './constants';
import { Utils } from './utils';
import { Message } from './message';
import { TemplateConfig } from '../models/TemplateConfig';
import { Text } from './texts';

export class ImportHelper {
  static importZip(path) {
    try {
      Message.info(Text.parse(Text.importStart, path));
      const zip = new AdmZip(path);
      const packageFile = zip.getEntry('package.json');
      if (packageFile) {
        const packageJson = JSON.parse(packageFile.getData().toString(CHARSET));
        const config = Config.getBaseContent();
        const cdnPath = packageJson.resources.filesCDN;
        const entries = zip.getEntries();
        Message.info(Text.importExtractCDN);
        this.extractCDN(entries, cdnPath);
        Message.info(Text.importExtractCDNComplete);
        const templatePath = packageJson.resources.database;
        Message.info(Text.importExtractTemplates);
        this.extractTemplates(entries, templatePath, config);
        Message.info(Text.importExtractTemplatesComplete);
        Message.info(Text.importWriteConfig);
        Config.writeConfig(config);
        Message.info(Text.importComplete);
      } else {
        Message.error(Text.importErrorNoPackageJson);
      }
    } catch (e) {
      Message.error(e);
      Message.info(Text.generalErrorAbort);
    }
  }

  static extractCDN(entries, cdnPath) {
    entries.forEach((entry) => {
      if (entry.entryName.indexOf(cdnPath + '/') === 0) {
        if (entry.isDirectory) {
          this.createCDNFolder(entry.entryName);
        } else {
          this.createCDNFile(entry);
        }
      }
    });
  }

  static createCDNFolder(entryName) {
    const folderArr = entryName.split('/');
    folderArr.shift();
    let folderPath = CDNPATH;
    folderArr.forEach((folder) => {
      folderPath = path.join(folderPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
    });
  }

  static createCDNFile(entry) {
    const folderArr = entry.entryName.split('/');
    folderArr.shift();
    folderArr.unshift(CDNPATH);
    fs.writeFileSync(folderArr.join(path.sep), entry.getData().toString('utf8'));
  }

  static extractTemplates(entries, templatePath, config) {
    entries.forEach((entry) => {
      if (entry.entryName.indexOf(templatePath + '/') === 0) {
        if (!entry.isDirectory) {
          this.createTemplateFile(entry, config);
        }
      }
    });
  }

  static createTemplateFile(entry, config) {
    const jsonData = JSON.parse(entry.getData().toString(CHARSET));
    const templateType = Utils.findTemplateType(jsonData.otype);
    if (templateType) {
      fs.writeFileSync(
        path.join(templateType.path, (jsonData.okey ? jsonData.okey : this.cleanTitle(jsonData.title)) + '.pug'),
        jsonData.body
      );
      this.updateOrCreateConfig(jsonData, config);
    }
  }

  static updateOrCreateConfig(jsonData, config) {
    const templateType = Utils.findTemplateType(jsonData.otype);
    if (templateType) {
      const okey = jsonData.okey ? jsonData.okey : this.cleanTitle(jsonData.title);
      const templateConfigArr = config[templateType.config].filter((layout) => {
        return layout.okey === okey;
      });
      let templateConfig = templateConfigArr[0];
      if (!templateConfig) {
        templateConfig = new TemplateConfig();
        config[templateType.config].push(templateConfig);
      }
      templateConfig.okey = okey;
      templateConfig.descr = jsonData.descr;
      if (jsonData.custFields) {
        templateConfig.custFields = jsonData.custFields;
      }
      templateConfig.id = jsonData.id;
      templateConfig.title = jsonData.title;
    }
  }

  static cleanTitle(title) {
    title = title.split(' ');
    for (let i = 0; i < title.length; i++) {
      if (i === 0) {
        title[i] = title[i].charAt(0).toLowerCase() + title[i].slice(1);
      } else {
        title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
      }
    }
    return title.join('');
  }
}
