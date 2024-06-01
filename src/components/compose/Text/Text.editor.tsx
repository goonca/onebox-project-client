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
      longFormattedText
    };

    comp.current = {
      ...comp.current,
      ...changes
    };
    props.onChange && props.onChange(comp.current);
  };

  const changeSpacing = ({ paddingTop, paddingBottom }: SpacingReturn) => {
    const changes = {
      paddingTop,
      paddingBottom
    };

    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(comp.current);
  };

  useEffect(() => {
    console.log(props.component);
    //mdEditorRef.current?.reset(props.component?.longText);
    comp.current = props.component ?? {};
    setComponent(props.component as ComponentModel);
  }, [props.component?.id, props.component?.tempId]);

  return (
    <>
      <div className={style['text-editor']}>
        <div className={style['markdown-editor']}>
          <MarkdownEditor
            key={`${(component && component.id) ?? 0}${
              (component && component.tempId) ?? 0
            }`}
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
