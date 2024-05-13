import { ComponentModel } from 'shared/types/api-type';
import { MarkdownEditor } from '../__parts/MarkdownEditor/MarkdownEditor';
import { Spacing } from '../__parts/Spacing/Spacing';
import style from './Quote.module.scss';

export const QuoteEditor = (component: ComponentModel) => {
  return (
    <>
      <div className={style['quote-editor']}>
        <div className={style['markdown-editor']}>
          <MarkdownEditor />
        </div>
        <div className={style['spacing']}>
          <Spacing />
        </div>
      </div>
    </>
  );
};
