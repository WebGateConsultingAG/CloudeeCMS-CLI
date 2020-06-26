/**
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
import path from 'path';
import {
  CHARSET,
  FieldVars,
  DISTPATH,
  FieldTypes,
  SELECTVALUESPATH,
  CDNPATH,
  TEMPLATEPATH,
  GLOBALSCRIPTSPATH,
  GLOBALSCRIPTSFILENAME,
} from './constants';
import { Field } from '../models/field';
import { Message } from './message';
import { Template } from '../models/template';
import AdmZip from 'adm-zip';
import { Text } from './texts';
import { request } from 'http';
import { GlobalScript } from '../models/globalScript';
import { Utils } from './utils';

export class FileHelper {
  constructor() {}
  static readFiles(folderName) {
    return fs.readdirSync(folderName);
  }

  static createTemplateFromFile(templateFile, templateType) {
    const fileNameArray = templateFile.split('.');
    fileNameArray.pop();
    const fileName = fileNameArray.join('.');
    const data = fs.readFileSync(path.join(templateType.path, templateFile), CHARSET);
    const template = Template.createTemplate(data, templateType, fileName);
    template.custFields = this.addFields(data);
    return template;
  }

  static createGlobalScriptFromFile(scriptFile) {
    const fileNameArray = scriptFile.split('.');
    fileNameArray.pop();
    const fName = fileNameArray.join('.');
    const body = fs.readFileSync(path.join(GLOBALSCRIPTSPATH, scriptFile), CHARSET);
    return new GlobalScript(fName, body);
  }

  static addFields(body) {
    const fields = [];
    if (body.indexOf(FieldVars.ESCAPEDSTART) > -1 || body.indexOf(FieldVars.UNESCAPEDSTART) > -1) {
      const escapedFieldArr = body.split(FieldVars.ESCAPEDSTART).slice(1);
      const unescapedFieldArr = body.split(FieldVars.UNESCAPEDSTART).slice(1);
      const fieldArr = escapedFieldArr.concat(unescapedFieldArr);
      fieldArr.forEach((field) => {
        let fieldName = Utils.getFieldName(field);
        if (fieldName) {
          if (fieldName.indexOf('doc.') === 0) {
            fieldName = fieldName.substr(4);
          }
          if (fieldName.indexOf('env.') !== 0 && !Utils.fieldExist(fields, fieldName)) {
            fields.push(Field.createField(fieldName));
          }
        }
      });
    }
    return fields;
  }

  static writeCloudeeFile(template) {
    fs.writeFileSync(path.join(DISTPATH, TEMPLATEPATH, template.id + '.json'), JSON.stringify(template), CHARSET, function (error) {
      if (error) {
        Message.error(error);
        Message.reset();
      }
    });
  }

  static writeGlobalScriptFile(globalScripts) {
    fs.writeFileSync(path.join(DISTPATH, GLOBALSCRIPTSFILENAME), JSON.stringify(globalScripts), CHARSET);
  }

  static existsTemplatePathCreateIfNot() {
    const dbPath = path.join(DISTPATH, TEMPLATEPATH);
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath);
    }
  }

  static writePackageToDist(packageJson) {
    fs.writeFileSync(path.join(DISTPATH, 'package.json'), JSON.stringify(packageJson), CHARSET, function (error) {
      if (error) {
        Message.error(error);
        Message.reset();
      }
    });
  }

  static clearDistFolder() {
    const filesAndFolders = this.readFiles(DISTPATH);
    filesAndFolders.forEach((pathToRemove) => {
      this.deleteRecursive(path.join(DISTPATH, pathToRemove));
    });
  }

  static deleteRecursive(pathToRemove) {
    const exists = fs.existsSync(pathToRemove);
    const stats = exists && fs.statSync(pathToRemove);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      const filesAndFolders = this.readFiles(pathToRemove);
      filesAndFolders.forEach((fileOrFolder) => {
        this.deleteRecursive(path.join(pathToRemove, fileOrFolder));
      });
      fs.rmdirSync(pathToRemove);
    } else {
      fs.unlinkSync(pathToRemove);
    }
  }

  static addSelectValues(fields) {
    if (fields) {
      fields.forEach((field) => {
        if (field.fldType === FieldTypes.DROPDOWN) {
          if (field.selectValueFile) {
            const selValues = fs.readFileSync(path.join(SELECTVALUESPATH, field.selectValueFile), CHARSET);
            field.selValues = JSON.parse(selValues);
          }
        }
        delete field.selectValueFile;
      });
    }
  }

  static createJsonFromJsonSelect(selValues) {
    const values = selValues.split('\n');
    const selVals = [];
    values.forEach((value) => {
      value = value.replace('\r', '');
      const selectValue = value.split('|');
      selVals.push({ val: selectValue[1], label: selectValue[0] });
    });
    return selVals;
  }

  static writeCDNFiles() {
    this.copyRecursive(CDNPATH, path.join(DISTPATH, CDNPATH));
  }

  static copyRecursive(pathToCopy, destination) {
    const exists = fs.existsSync(pathToCopy);
    const stats = exists && fs.statSync(pathToCopy);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(destination);
      fs.readdirSync(pathToCopy).forEach((childToCopy) => {
        FileHelper.copyRecursive(path.join(pathToCopy, childToCopy), path.join(destination, childToCopy));
      });
    } else {
      fs.copyFileSync(pathToCopy, destination);
    }
  }

  static buildCloudeeZip() {
    const zip = new AdmZip();
    zip.addLocalFolder(DISTPATH);
    zip.writeZip(path.join(DISTPATH, 'design.zip'));
  }

  static getPackageData(info) {
    Message.info(Text.parse(Text.packageInfoTitle, info.data.filename));
    Message.info(Text.parse(Text.packageInfoCopyright, info.data.copyright));
    Message.info(Text.parse(Text.packageDescription, info.data.description));
    var fileUrl = info.data.url;
    var fileName = info.data.filename;
    request({ url: fileUrl, encoding: null }, function (err, resp, body) {
      if (err) throw err;
      fs.writeFileSync(fileName, body, function () {
        Message.info(Text.packageDownloadComplete);
      });
      this.extractPackageData(fileName);
    });
  }

  static extractPackageData(data, fileName) {
    fs.writeFileSync(fileName, data);
  }
}
