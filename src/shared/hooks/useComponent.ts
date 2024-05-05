import { Figure } from 'components/compose/Figure';
import { Quote } from 'components/compose/Quote';
import { Text } from 'components/compose/Text';
import {
  ComponentName,
  EditorComponentType
} from 'src/pages/__dashboard/ComposeNews/__parts/FreeEditor/FreeEditor';

export type ComponentType = {
  getComponentByName: (name: ComponentName) => EditorComponentType;
};

export const useComponent = (): ComponentType => {
  const getComponentByName = (name: ComponentName): any => {
    let node: any;

    switch (name) {
      case 'Figure':
        node = Figure;

        break;
      case 'Text':
        node = Text;

        break;

      case 'Quote':
        node = Quote;
        break;
    }

    return node;
  };

  return { getComponentByName };
};
