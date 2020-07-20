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
