import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';
import { MarkdownEditor } from '../__parts/MarkdownEditor/MarkdownEditor';
import { Spacing } from '../__parts/Spacing/Spacing';
import style from './Text.module.scss';

export const TextEditor = ({ component, onChange }: ComponentEditorProps) => {
  return (
    <>
      <div className={style['text-editor']}>
        <div className={style['markdown-editor']}>
          <MarkdownEditor onChange={onChange} />
        </div>
        <div className={style['spacing']}>
          <Spacing />
        </div>
      </div>
    </>
  );
};
