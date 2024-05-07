import { Figure } from 'components/compose/Figure';
import { Quote } from 'components/compose/Quote';
import { Text } from 'components/compose/Text';
import React from 'react';
import { ComponentModel, ComponentType } from 'shared/types/api-type';

export type UseComponentType = {
  getComponentByType: (type: ComponentType) => ComponentModel;
};

export const useComponent = () => {
  const getComponentByType = (type?: ComponentType): any => {
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

      default:
        node = React.createElement('span');
    }

    return node;
  };

  return { getComponentByType };
};
