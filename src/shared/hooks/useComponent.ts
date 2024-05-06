import { Figure } from 'components/compose/Figure';
import { Quote } from 'components/compose/Quote';
import { Text } from 'components/compose/Text';
import {
  ComponentType,
  EditorComponentType
} from 'src/pages/__dashboard/ComposeNews/__parts/FreeEditor/FreeEditor';

export type UseComponentType = {
  getComponentByType: (type: ComponentType) => EditorComponentType;
};

export const useComponent = () => {
  const getComponentByType = (type: ComponentType): any => {
    let node: any;

    switch (type) {
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

  return { getComponentByType };
};
