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
import { TemplateTypes, DISTPATH, CDNPATH, SELECTVALUESPATH, TEMPLATEURL } from '../utils/constants';
import fs from 'fs';
export class Init {
  static start() {
    Object.keys(TemplateTypes).forEach((key) => {
      const path = TemplateTypes[key].path;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    });
    if (!fs.existsSync(DISTPATH)) {
      fs.mkdirSync(DISTPATH);
    }
    if (!fs.existsSync(CDNPATH)) {
      fs.mkdirSync(CDNPATH);
    }
    if (!fs.existsSync(SELECTVALUESPATH)) {
      fs.mkdirSync(SELECTVALUESPATH);
    }
  }
}
