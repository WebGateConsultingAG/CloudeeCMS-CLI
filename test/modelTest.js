const assert = require('assert');
const { Field } = require('../src/models/field');
const { GlobalScript } = require('../src/models/globalScript');
const { TemplateConfig } = require('../src/models/templateConfig');
const { Template } = require('../src/models/template');
const { TemplateTypes, GLOBALSCRIPTSFILENAME } = require('../src/utils/constants');
const { Config } = require('../src/actions/config');
const { Package } = require('../src/models/package');
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
      assert(packageObject.resources.globalfunctions === GLOBALSCRIPTSFILENAME);
    });
  });
});
