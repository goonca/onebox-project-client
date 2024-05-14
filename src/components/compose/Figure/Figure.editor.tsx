import { ComponentModel } from 'shared/types/api-type';
import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';
import { MDEditorReturn } from 'shared/types/MDEditorReturn';
import {
  MarkdownEditor,
  MarkdownEditorProps
} from '../__parts/MarkdownEditor/MarkdownEditor';
import { Spacing } from '../__parts/Spacing/Spacing';
import style from './Figure.module.scss';

export const FigureEditor = ({ component, onChange }: ComponentEditorProps) => {
  return (
    <>
      <div className={style['figure-editor']}>figure editor</div>
    </>
  );
};