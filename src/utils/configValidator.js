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
import { FieldTypes } from './constants';
import { Message } from './message';
import { Text } from './texts';
export class ConfigValidator {
  constructor() {}
  static validate(config) {
    let valid = true;
    if (!config.title) {
      Message.warn(Text.validatorNoTitle);
    }
    const templates = config.layouts.concat(config.layoutBlocks).concat(config.microTemplates);
    Object.keys(templates).forEach((key) => {
      const template = templates[key];
      const okey = template.okey;
      if (!template.title) {
        Message.error(Text.parse(Text.validatorTemplateNoTitle, okey));
        valid = false;
      }
      if (!template.descr) {
        Message.warn(Text.parse(Text.validatorTemplateNoDescription, okey));
      }
      if (!template.id) {
        Message.error(Text.parse(Text.validatorTemplateNoId, okey));
        valid = false;
      }
      if (template.restrictChilds) {
        if (!template.accepts) {
          Message.error(Text.validatorNoAccess);
          valid = false;
        }
      }
      if (!this.validateFields(template.custFields, okey)) {
        valid = false;
      }
    });
    return valid;
  }

  static validateFields(fields, okey) {
    let fieldsValid = true;
    if (fields) {
      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        if (!field.ignore) {
          if (!field.fldName) {
            Message.error(Text.parse(Text.configMissingFieldName), okey);
            fieldsValid = false;
          }
          if (!field.fldType || !Object.values(FieldTypes).includes(field.fldType)) {
            Message.error(Text.parse(Text.configFieldWrongType, field.fldName, okey, Object.values(FieldTypes).join()));
            fieldsValid = false;
          }
          if (!field.fldTitle) {
            Message.warn(Text.parse(Text.configFieldMissingTitle, field.fldName, okey));
          }
        }
      });
    }
    return fieldsValid;
  }
}
