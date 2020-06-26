import { FileHelper } from '../src/utils/fileHelper';
import { DISTPATH, CDNPATH, SELECTVALUESPATH, GLOBALSCRIPTSPATH, TemplateTypes } from '../src/utils/constants';

export class TestUtils {
  static clearTestFolders() {
    Object.keys(TemplateTypes).forEach((key) => {
      const path = TemplateTypes[key].path;
      FileHelper.deleteRecursive(path);
    });
    FileHelper.deleteRecursive(DISTPATH);
    FileHelper.deleteRecursive(CDNPATH);
    FileHelper.deleteRecursive(SELECTVALUESPATH);
    FileHelper.deleteRecursive(GLOBALSCRIPTSPATH);
  }
}
