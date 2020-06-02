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
import { Init } from './actions/init';
import { Builder } from './actions/build';
import { Actions } from './utils/constants';
import { Config } from './actions/config';
import { Help } from './actions/help';
import { Message } from './utils/message';
import { TemplateGetter } from './actions/get';
import { TemplateLoader } from './actions/load';
import { Text } from './utils/texts';

export function cli(args) {
  const options = args.slice(2);
  const action = options[0];
  const option = options[1];
  switch (action) {
    case Actions.INIT:
      Init.start(option);
      break;
    case Actions.BUILD:
      Builder.start();
      break;
    case Actions.CONFIG:
      Config.start();
      break;
    case Actions.HELP:
      Help.start();
      break;
    case Actions.GET:
      TemplateGetter.start(option);
      break;
    case Actions.LOAD:
      TemplateLoader.start(option);
      break;
    default:
      Message.info(Text.cliNoAction);
      Message.info(Text.cliUseHelp);
  }
}
