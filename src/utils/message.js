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
const consoleColorRed = '\x1b[31m';
const consoleColorYellow = '\x1b[33m';
const consoleColorWhite = '\x1b[0m';
export class Message {
  constructor() {}
  static error(message) {
    console.error(consoleColorRed, 'Error: ' + message);
  }
  static warn(message) {
    console.warn(consoleColorYellow, 'Warning: ' + message);
  }
  static reset() {
    console.log(consoleColorWhite, '----------------------------');
  }
  static info(message) {
    console.log(consoleColorWhite, message);
  }
}
