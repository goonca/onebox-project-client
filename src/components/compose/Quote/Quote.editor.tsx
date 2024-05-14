import { useEffect, useRef, useState } from 'react';
import { ComponentModel } from 'shared/types/api-type';
import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';
import { Spacing } from '../__parts/Spacing/Spacing';
import style from './Quote.module.scss';

export const QuoteEditor = (props: ComponentEditorProps) => {
  const [component, setComponent] = useState<ComponentModel>(
    props.component as ComponentModel
  );

  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const changeText = () => {
    const text = refTextarea.current?.value ?? '';
    const formattedText = text.replace(/(?:\r|\n|\r\n)/g, '<br/>');
    props.onChange && props.onChange({ text, formattedText });
  };

  useEffect(() => {
    console.log('changed', props.component);
    refTextarea.current &&
      (refTextarea.current.value = props.component?.longText ?? '');
    setComponent(props.component as ComponentModel);
  }, [props.component?.id]);

  return (
    <>
      <div className={style['quote-editor']}>
        <div className={style['markdown-editor']}>
          <textarea
            id="textarea"
            ref={refTextarea}
            onChange={changeText}
            defaultValue={component?.longText}
          ></textarea>
        </div>
        <div className={style['spacing']}>
          <Spacing />
        </div>
      </div>
    </>
  );
};
