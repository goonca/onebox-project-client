import { useState, useRef, useEffect } from 'react';
import { ComponentModel } from 'shared/types/api-type';
import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';
import { EditorReturn } from 'shared/types/EditorReturn';
import { MarkdownEditor } from '../__parts/MarkdownEditor/MarkdownEditor';
import { Spacing, SpacingReturn } from '../__parts/Spacing/Spacing';
import style from './Text.module.scss';

export const TextEditor = (props: ComponentEditorProps) => {
  const [component, setComponent] = useState<ComponentModel>(
    props.component as ComponentModel
  );
  let comp = useRef<ComponentModel>(props.component as ComponentModel);

  const changeText = ({ longText, longFormattedText }: EditorReturn) => {
    //console.log(longText, longFormattedText);
    const changes = {
      longText,
      longFormattedText,
      paddingTop: comp.current.paddingTop,
      paddingBottom: comp.current.paddingBottom
    };

    comp.current = {
      ...comp.current,
      ...changes
    };
    props.onChange && props.onChange(changes);
  };

  const changeSpacing = ({ paddingTop, paddingBottom }: SpacingReturn) => {
    const changes = {
      paddingTop,
      paddingBottom,
      longText: comp.current.longText,
      longFormattedText: comp.current.longFormattedText
    };

    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(changes);
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
