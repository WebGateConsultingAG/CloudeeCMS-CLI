<img src="https://cdn.cloudee-cms.com/img/CloudeeCMS-h0bb.svg" width="256">
# Cloudee CLI

CloudeeCMS-CLI provides an easy way to create your design for [CloudeeCMS](https://www.cloudee-cms.com) from the command line interface.

## Installation

```bash
npm install cloudeecli
```

### Init
After installation of CloudeeCMS-CLI, the first step is to init your application design

```bash
cloudee init
```

This command will create the folder structure where you can store your CloudeeCMS Design. For more information go to https://www.cloudee-cms.com

### Config
Create or update your CloudeeCMS configuration file.

```bash
cloudee config
```

All the required information to build a CloudeeCMS Design Package is stored in a yaml file named config.yaml.
With the config command you create or update your config.yaml file. The CLI will read all data in your template and insert it in the configuration.

### Get
Download a CloudeeCMS Design Package from the CloudeeCMS online repository. 

```bash
cloudee get packageId
```

Use 'demo' as packageId to get the most recent version of the demo template. Later a marketplace will be available to browse for more templates or even publish your own.


### Load
Load a CloudeeCMS Design Package ZIP that is stored locally. 
```bash
cloudee load mypackage.zip
```
Using this command you can load a package you downloaded or a package you created using the CLI.


### Build

To Build the your CloudeeCMS Design Package run the command

```bash
cloudee build
```

Attention: You must fill in the config.yaml file. Especially the fieldTypes must be set. If you ignore this, the build step will fail with error messages.

