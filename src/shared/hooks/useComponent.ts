import { Figure } from 'components/compose/Figure';
import { FigureEditor } from 'components/compose/Figure/Figure.editor';
import { Quote } from 'components/compose/Quote';
import { QuoteEditor } from 'components/compose/Quote/Quote.editor';
import { Text } from 'components/compose/Text';
import { TextEditor } from 'components/compose/Text/Text.editor';
import React from 'react';
import { ComponentModel, ComponentType } from 'shared/types/api-type';

export type UseComponentType = {
  getComponentByType: (type: ComponentType) => any;
  getEditorByType: (type: ComponentType) => any;
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

  const getEditorByType = (type?: ComponentType): any => {
    let node: any;

    switch (type) {
      case 'Figure':
        node = FigureEditor;
        break;

      case 'Text':
        node = TextEditor;
        break;

      case 'Quote':
        node = QuoteEditor;
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

  return { getComponentByType, getValidComponents, getEditorByType };
};
