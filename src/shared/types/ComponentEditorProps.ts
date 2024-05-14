import { MarkdownEditorProps } from 'components/compose/__parts/MarkdownEditor/MarkdownEditor';
import { ComponentModel } from './api-type';

export type ComponentEditorProps = {
  component?: ComponentModel;
} & MarkdownEditorProps;
