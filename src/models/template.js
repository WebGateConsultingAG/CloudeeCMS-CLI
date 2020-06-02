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
export class Template {
  constructor() {
    this.title = null;
    this.descr = null;
    this.otype = null;
    this.okey = null;
    this.custFields = null;
    this.ptype = 'pugfile';
    this.id = null;
    this.body = null;
  }
  static createTemplate(data, templateType, fileName) {
    const template = new Template();
    template.body = data;
    template.otype = templateType.type;
    template.id = null;
    template.okey = fileName;
    template.title = '';
    template.descr = '';
    return template;
  }
}
