import { Figure } from 'components/compose/Figure';
import { Quote } from 'components/compose/Quote';
import { Text } from 'components/compose/Text';
import React from 'react';
import { ComponentModel, ComponentType } from 'shared/types/api-type';

export type UseComponentType = {
  getComponentByType: (type: ComponentType) => ComponentModel;
  getValidComponents(components: ComponentModel[]): ComponentModel[];
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

  const getValidComponents = (
    components: ComponentModel[]
  ): ComponentModel[] => {
    return components
      .reduce((accumulator: ComponentModel[], current: ComponentModel) => {
        let isInvalid = accumulator.find(item => {
          return (
            (item.id && item.id === current.id) ||
            (item.tempId && item.tempId === current.tempId) ||
            !!!current.type
          );
        });
        if (!isInvalid) {
          accumulator = accumulator.concat(current);
        }
        return accumulator;
      }, [])
      .sort(
        (a: ComponentModel, b: ComponentModel) =>
          (a.position ?? 0) - (b.position ?? 0)
      );
  };

  return { getComponentByType, getValidComponents };
};
