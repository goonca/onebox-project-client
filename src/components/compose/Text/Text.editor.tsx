import { useState, useRef, useEffect } from 'react';
import { ComponentModel } from 'shared/types/api-type';
import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';
import { EditorReturn } from 'shared/types/EditorReturn';
import {
  MarkdownEditor,
  MarkdownEditorProps
} from '../__parts/MarkdownEditor/MarkdownEditor';
import { Spacing, SpacingReturn } from '../__parts/Spacing/Spacing';
import style from './Text.module.scss';

export const TextEditor = (props: ComponentEditorProps) => {
  const [component, setComponent] = useState<ComponentModel>(
    props.component as ComponentModel
  );
  //const mdEditorRef = useRef<any>(null);

  const changeText = ({ longText, longFormattedText }: EditorReturn) => {
    console.log(longText, longFormattedText);
    props.onChange &&
      props.onChange({
        longText,
        longFormattedText,
        marginTop: (props.component?.marginTop ?? 0) as unknown as number,
        marginBottom: (props.component?.marginBottom ?? 0) as unknown as number
      });
  };

  const changeSpacing = ({ marginTop, marginBottom }: SpacingReturn) => {
    props.onChange &&
      props.onChange({
        marginTop,
        marginBottom,
        longText: props.component?.longText,
        longFormattedText: props.component?.longFormattedText
      });
  };

  useEffect(() => {
    //console.log(props.component);
    //mdEditorRef.current?.reset(props.component?.longText);
    setComponent(props.component as ComponentModel);
  }, [props.component?.id]);

  return (
    <>
      <div className={style['text-editor']}>
        <div className={style['markdown-editor']}>
          <MarkdownEditor
            key={`${component.id ?? 0}${component.tempId ?? 0}`}
            onChange={changeText}
            initialValue={component?.longText}
          />
        </div>
        <div className={style['spacing']}>
          <Spacing onChange={changeSpacing} component={component} />
        </div>
      </div>
    </>
  );
};
