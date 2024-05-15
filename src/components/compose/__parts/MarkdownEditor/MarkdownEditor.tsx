//@ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EditorReturn } from 'shared/types/EditorReturn';

export type MarkdownEditorProps = {
  onChange?: (status: EditorReturn) => void;
  initialValue?: string;
};

export const MarkdownEditor = forwardRef(function MarkdownEditor(
  props: MarkdownEditorProps,
  ref
) {
  useImperativeHandle(
    ref,
    () => {
      return {
        /*reset(initialValue?: string) {
          resetEditor(initialValue);
        }*/
      };
    },
    []
  );

  const parentRef = useRef<HTMLDivElement>(null);

  /*const resetEditor = (initialValue?: string) => {
    //console.log('resetEditor');
    parentRef.current.innerHTML = '';
    window.simplemde = undefined;
    buildEditor(initialValue);
  };*/

  const onFullscreen = (active: boolean) => {
    document
      .querySelectorAll(
        'div[class*="Layout_left-side"], div[data-component="header"]'
      )
      .forEach(c => {
        (c as HTMLElement).style.display = active ? 'none' : '';
      });
  };

  const buildEditor = (initialValue?: string) => {
    const codemirror = document.querySelector('.CodeMirror');
    if (!codemirror) {
      parentRef.current.innerHTML = '<textarea id="markdownEditor"></textarea>';
      window.simplemde = new SimpleMDE({
        element: document.getElementById('markdownEditor') ?? undefined,
        spellChecker: false,
        status: false,
        initialValue: initialValue ?? props.initialValue,
        onFullscreen: onFullscreen
      });

      window.simplemde.codemirror.on('change', () => {
        props.onChange &&
          props.onChange({
            longText: window.simplemde.value(),
            longFormattedText: window.simplemde.options.previewRender(
              window.simplemde.value()
            )
          });
      });
    }
  };

  useEffect(() => {
    buildEditor();
  }, []);
  return (
    <>
      <div ref={parentRef}></div>
    </>
  );
});
