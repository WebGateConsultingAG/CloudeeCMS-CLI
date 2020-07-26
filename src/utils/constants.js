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
export const TemplateTypes = {
  LAYOUT: {
    path: 'Layouts',
    type: 'Layout',
    config: 'layouts',
    prefix: 'L_',
  },
  LAYOUTBLOCK: {
    path: 'LayoutBlocks',
    type: 'Block',
    config: 'layoutBlocks',
    prefix: 'C_',
  },
  MICROTEMPLATE: {
    path: 'MicroTemplates',
    type: 'MT',
    config: 'microTemplates',
    prefix: 'MT_',
  },
  FORMS: {
    path: 'Forms',
    type: 'Form',
    config: 'forms',
    prefix: 'F_',
  },
};
export const SYSTEM_FIELDNAMES = [
  'sidenav',
  'myBodyField',
  'title',
  'opath',
  'dt',
  'sitemap',
  'ftindex',
  'layout',
  'id',
  'otype',
  'descr',
  'keywords',
  'publishDT',
  'updateDT',
  'env.CDNWEBURL',
  'env.navtree',
  'myAuthorField',
];
export const VERSION = '0.2.5';
export const CONFIGPATH = 'config.yaml';
export const DISTPATH = 'Dist';
export const CDNPATH = 'Cdn';
export const TEMPLATEPATH = 'templates';
export const SELECTVALUESPATH = 'SelectValues';
export const GLOBALSCRIPTSPATH = 'GlobalScripts';
export const GLOBALSCRIPTSFILENAME = 'globalFunctions.json';
export const Actions = {
  INIT: 'init',
  BUILD: 'build',
  CONFIG: 'config',
  HELP: '--help',
  GET: 'get',
  LOAD: 'load',
};

export const FieldTypes = {
  DROPDOWN: 'dropdown',
  TEXT: 'text',
  TEXTAREA: 'textarea',
  RICHTEXT: 'richtext',
  CONTAINER: 'container',
  NUMBER: 'number',
  IMAGE: 'image',
  CHECKBOX: 'checkbox',
};

export const CHARSET = 'utf8';
export const FieldVars = {
  ESCAPEDSTART: '#{',
  UNESCAPEDSTART: '!{',
  END: '}',
};
export const TEMPLATEURL = 'https://notifications.cloudee-cms.com/api/packages';
