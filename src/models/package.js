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
import { CDNPATH, TEMPLATEPATH, GLOBALSCRIPTSFILENAME } from '../utils/constants';
export class Package {
  constructor(config) {
    this.type = 'CloudeeCMS-Package';
    this.title = config.title;
    this.description = config.description;
    this.categories = ['Website Templates'];
    this.packageformat = '1.0';
    this.cliVersion = '0.1.1';
    this.resources = {
      variables: config.environmentVariables,
      database: TEMPLATEPATH,
      filesCDN: CDNPATH,
      globalfunctions: GLOBALSCRIPTSFILENAME,
    };
  }
}
