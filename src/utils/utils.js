import { Message } from './message';
import { Text } from './texts';
import { TemplateTypes } from './constants';

export class Utils {
  static findTemplateType(type) {
    switch (type) {
      case TemplateTypes.LAYOUT.type:
        return TemplateTypes.LAYOUT;
      case TemplateTypes.LAYOUTBLOCK.type:
        return TemplateTypes.LAYOUTBLOCK;
      case TemplateTypes.MICROTEMPLATE.type:
        return TemplateTypes.MICROTEMPLATE;
      default:
        Message.info(Text.parse(Text.utilNoTemplateTypeFound, type));
        return null;
    }
  }
}
