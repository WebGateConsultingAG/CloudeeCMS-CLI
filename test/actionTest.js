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

const { TemplateTypes, DISTPATH, CDNPATH, SELECTVALUESPATH, GLOBALSCRIPTSPATH } = require('../src/utils/constants');
const { Init } = require('../src/actions/init');
const { TestUtils } = require('./testUtils');

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
