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

const { Field } = require('../src/models/field');
const { TemplateTypes } = require('../src/utils/constants');
const { Utils } = require('../src/utils/utils');
const { JSConverter } = require('../src/utils/jsConverter');
const { CSSConverter } = require('../src/utils/cssConverter');

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
      const js = 'function test(){\n\r  var test = "Helo World";\n\r\ttest +=      " my friend";\n\rreturn test;}';
      const compressedJS = JSConverter.compress(js);
      const compressedJSForPug = JSConverter.compressForPug(js);
      assert(compressedJS === 'function test(){var r="Helo World";return r+=" my friend"}');
      assert(compressedJSForPug === '- function test(){var r="Helo World";return r+=" my friend"}');
      eval(compressedJS);
      const testReturn = test();
      assert(testReturn === 'Helo World my friend');
    });
  });

  describe('#compressCSS', function () {
    it('Check if cloudee remove linebreaks, tabs and spaces in the right way.', function () {
      const css = 'body{\n\r\twidth:100%;\n\r\theight:100%;\n\r\t}\n\r\t.testClass{\n\r\twidth:100%;\n\r\theight:100%;\n\r\t}';
      const compressedCSS = CSSConverter.compress(css);
      assert(compressedCSS === 'body{width:100%;height:100%}.testClass{width:100%;height:100%}');
    });
  });

  describe('#getFieldName', function () {
    it('Found a fieldName from a pattern.', function () {
      const patternSuccess = 'love}some other stuff';
      assert(Utils.getFieldName(patternSuccess) === 'love');
      const patternNoSucssess = 'nofieldVariable';
      assert(Utils.getFieldName(patternNoSucssess) === null);
    });
  });
  describe('#fieldExist', function () {
    it('Check if an fieldName exists in an Array.', function () {
      const field = new Field();
      field.fldName = 'testField';
      const fields = [field];
      assert(Utils.fieldExist(fields, 'testField'));
      assert(!Utils.fieldExist(fields, 'notInArray'));
    });
  });
});
