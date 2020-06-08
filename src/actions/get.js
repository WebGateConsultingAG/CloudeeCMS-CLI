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
import { Init } from './init';
import https from 'https';
import { Message } from '../utils/message';
import { Text } from '../utils/texts';
import { FileHelper } from '../utils/fileHelper';
import { TEMPLATEURL } from '../utils/constants';
import { ImportHelper } from '../utils/importHelper';
export class TemplateGetter {
  static start(id) {
    Init.start();
    if (id) {
      this.getPackageInfo(id);
    }
  }
  //load package Info from CloudeeCMS S3
  static getPackageInfo(id) {
    Message.info(Text.packageInfoTitle, id);
    const path = TEMPLATEURL + '?action=getpkginfo&id=' + id;
    https
      .get(path, (resp) => {
        let response = '';
        resp.on('data', (chunk) => {
          response += chunk;
        });
        resp.on('end', () => {
          this.getPackageZip(JSON.parse(response));
        });
      })
      .on('error', (err) => {
        Message.error('Error while getting package info: ', err);
        Message.info('Get not possible.');
      });
  }
  //load specified Design from CloudeeCMS S3
  static getPackageZip(info) {
    if (!info.data.success) {
      Message.error(info.data.message);
      Message.info(Text.packageImportAbort);
      return;
    }
    Message.info(Text.parse(Text.packageDownloadInfo, info.data.filename));
    Message.info(Text.parse(Text.packageInfoCopyright, info.data.copyright));
    Message.info(Text.parse(Text.packageDescription, info.data.description));
    https
      .get(info.data.url, { encoding: null }, (resp) => {
        let response = [];
        resp.on('data', (chunk) => {
          response.push(chunk);
        });
        resp.on('end', () => {
          Message.info(Text.downloadPackageComplete);
          FileHelper.extractPackageData(Buffer.concat(response), info.data.filename);
          ImportHelper.importZip(info.data.filename);
        });
      })
      .on('error', (err) => {
        Message.error('Error while getting package.zip: ', err);
        Message.info('Get not possible.');
      });
  }
}
