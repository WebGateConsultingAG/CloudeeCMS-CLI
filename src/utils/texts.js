/**
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
import { VERSION } from './constants';

export class Text {
  constructor() {}
  static parse(str) {
    const args = [].slice.call(arguments, 1);
    let i = 0;
    return str.replace(/%s/g, () => args[i++]);
  }
}
Text.packageInfoTitle = 'Start fetching package %s from CloudeeCMS cloud.';
Text.packageDownloadInfo = 'Download package info for %s completed!';
Text.packageInfoCopyright = 'Copyright %s.';
Text.packageDescription = '%s.';
Text.packageDownloadComplete = 'Downloading of package completed. Starting extraction.';
Text.packageImportAbort = 'Abort Import.';

Text.importStart = 'Start import %s.';
Text.importErrorNoPackageJson = 'Required file package.json not found in selected CloudeeCMS package ZIP file.';
Text.importExtractCDN = 'Extracting CDN Files.';
Text.importExtractCDNComplete = 'Extraction of CDN files completed.';
Text.importExtractTemplates = 'Extracting template files.';
Text.importExtractTemplatesComplete = 'Extraction of template files completed.';
Text.importWriteConfig = 'Writing config file.';
Text.importComplete = 'Import completed.';

Text.utilNoTemplateTypeFound = 'No Template Type found for the given type %s thats possible if you import an backup file.';

Text.helpTexts = [];
Text.helpTexts.push('############# CloudeeCMS - CLI Version: ' + VERSION + ' #############');
Text.helpTexts.push('Welcome to the CloudeeCMS CLI. Available commands:');
Text.helpTexts.push('cloudee init - build your folder structure.');
Text.helpTexts.push('cloudee get id - fetch a design template from the CloudeeCMS cloud and create the resources in your project.');
Text.helpTexts.push('cloudee load path - use the local path of a CloudeeCMS package ZIP file to create the resources in your project.');
Text.helpTexts.push('cloudee config - create or update the config.yaml file in your project. This function will not overwrite your input.');
Text.helpTexts.push('cloudee build - validate your configuration and build the package ZIP file for upload into CloudeeCMS.');
Text.helpTexts.push('More information can be found on https://www.cloudee-cms.com/');
Text.helpTexts.push('############# CloudeeCMS - CLI #############');

Text.buildStart = 'Start CloudeeCMS Build.';
Text.buildValidationStart = 'Start validation of config file.';
Text.buildValidationError = 'Validation error, see log above.';
Text.buildCleanDist = 'Removing older builds.';
Text.buildCreateFiles = 'Creating files for CloudeeCMS package ZIP.';
Text.buildCreateFilesComplete = 'Creating files for CloudeeCMS package ZIP completed.';
Text.buildCreateCDN = 'Copying CDN resources';
Text.buildCreateCDNComplete = 'Copying CDN resources completed.';
Text.buildPackageInfo = 'Creating package info.';
Text.buildPackageInfoComplete = 'Creating package info completed.';
Text.buildCreateDesignZip = 'Creating CloudeeCMS package ZIP.';
Text.buildComplete = 'CloudeeCMS package ZIP completed.';
Text.buildTemplateInfo = '%s templateType.type %s';
Text.createGlobalScripts = 'Create Global Scripts';
Text.createGlobalScriptsComplete = 'Create Global Scripts Complete';
Text.generalErrorAbort = 'Cloudee CLI aborted with errors.';

Text.cliNoAction = 'No action specified!';
Text.cliUseHelp = 'Use cloudee --help for more information!';

Text.configMissingFieldName = 'A fieldname in your template %s is empty!';
Text.configFieldWrongType = 'The field %s in your template %s has no or an invalid fieldType. Fieldtype must be one of the following: %s!';
Text.configFieldMissingTitle = 'The field %s in your template %s has no title attribute!';
Text.configStart = 'Start Cloudee config';

Text.validatorNoTitle = 'Your package has no title! Please define a title in your config.yaml';
Text.validatorTemplateNoTitle = 'Your template %s must have a title!';
Text.validatorTemplateNoDescription = 'Your template %s has no description!';
Text.validatorTemplateNoId = 'Your template %s must have an id!';
Text.validatorNoAcceptsDefined = 'Your field %s has defined restrictedChilds to true but the accepts array is missing.';
