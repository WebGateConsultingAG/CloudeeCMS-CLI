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
const assert = require('assert');
const fs = require('fs');

const { Field } = require('../src/models/field');
const { GlobalScript } = require('../src/models/globalScript');
const { TemplateConfig } = require('../src/models/TemplateConfig');
const { Template } = require('../src/models/template');
const { TemplateTypes, GLOBALSCRIPTSFILENAME, DISTPATH, CDNPATH, SELECTVALUESPATH, GLOBALSCRIPTSPATH } = require('../src/utils/constants');
const { Config } = require('../src/actions/config');
const { Package } = require('../src/models/package');
const { Utils } = require('../src/utils/utils');
const { Init } = require('../src/actions/init');
const { TestUtils } = require('./testUtils');

describe('Models', function () {
  describe('#Field', function () {
    it('should have the correct values', function () {
      const fldName = 'testField';
      const fldTitle = '(' + fldName + ')';
      const field = Field.createField(fldName);
      assert(field.fldName === fldName);
      assert(field.fldTitle === fldTitle);
      assert(field.fldType === null);
    });
  });
  describe('#GlobalScripts', function () {
    it('should have the correct values', function () {
      const name = 'testScript';
      const body = 'var test;';
      const globalScript = new GlobalScript(name, body);
      assert(globalScript.fName === name);
      assert(globalScript.body === body);
    });
  });
  describe('#TemplateConfig', function () {
    it('should have the correct values', function () {
      const templateConfig = new TemplateConfig();
      assert(templateConfig.okey === null);
      assert(templateConfig.title === null);
      assert(templateConfig.descr === null);
      assert(templateConfig.id === null);
      assert(templateConfig.custFields === null);
    });
  });
  describe('#Template', function () {
    it('should have the correct values', function () {
      const data = 'doctype html';
      const fileName = 'fileName';
      const template = Template.createTemplate(data, TemplateTypes.LAYOUT, fileName);
      assert(template.otype === TemplateTypes.LAYOUT.type);
      assert(template.body === data);
      assert(template.okey === fileName);
      assert(template.title === '');
      assert(template.descr === '');
      assert(template.id === null);
    });
  });
  describe('#Package', function () {
    it('should have the correct values', function () {
      const config = Config.getBaseContent();
      const packageObject = new Package(config);
      assert(packageObject.type === 'CloudeeCMS-Package');
      assert(packageObject.title === config.title);
      assert(packageObject.description === config.description);
      assert(packageObject.categories.length === 1);
      assert(packageObject.categories[0] === 'Website Templates');
      assert(packageObject.globalfunctions === GLOBALSCRIPTSFILENAME);
    });
  });
});
describe('Actions', function () {
  describe('#Init', function () {
    it('should create all needed folders', function () {
      Init.start();
      Object.keys(TemplateTypes).forEach((key) => {
        const path = TemplateTypes[key].path;
        assert(fs.existsSync(path));
        assert(fs.existsSync(DISTPATH));
        assert(fs.existsSync(CDNPATH));
        assert(fs.existsSync(SELECTVALUESPATH));
        assert(fs.existsSync(GLOBALSCRIPTSPATH));
      });
      TestUtils.clearTestFolders();
    });
  });
});
describe('Utils', function () {
  describe('#findTemplateType', function () {
    it('found template and get null if type is not in list', function () {
      const templateType = Utils.findTemplateType(TemplateTypes.LAYOUT.type);
      assert(templateType.type === TemplateTypes.LAYOUT.type);
      assert(templateType.path === TemplateTypes.LAYOUT.path);
      assert(templateType.config === TemplateTypes.LAYOUT.config);
      assert(templateType.prefix === TemplateTypes.LAYOUT.prefix);
      const notInList = 'notInList';
      assert(Utils.findTemplateType(notInList) === null);
    });
  });
  describe('#compressJS', function () {
    it('Check if cloudee remove linebreaks, tabs and spaces in the right way.', function () {
      const js = 'function test(){\n\r  let test = "Helo World";\n\r\ttest +=      " my friend";\n\rreturn test;}';
      const compressedJS = Utils.compressJS(js);
      assert(compressedJS === '- function test(){let test = "Helo World";test +=" my friend";return test;}');
      eval(compressedJS.substr(1));
      const testReturn = test();
      assert(testReturn === 'Helo World my friend');
    });
  });
});
