//@ts-nocheck
import { useEffect } from 'react';
import { MDEditorReturn } from 'shared/types/MDEditorReturn';

export type MarkdownEditorProps = {
  onChange?: (status: MDEditorReturn) => void;
};

export const MarkdownEditor = ({ onChange }: MarkdownEditorProps) => {
  //let simplemde;

  const onFullscreen = (active: boolean) => {
    document
      .querySelectorAll(
        'div[class*="Layout_left-side"], div[data-component="header"]'
      )
      .forEach(c => {
        c.style.display = active ? 'none' : '';
      });
  };

  useEffect(() => {
    const codemirror = document.querySelector('.CodeMirror');
    if (!codemirror) {
      window.simplemde = new SimpleMDE({
        element: document.getElementById('markdownEditor'),
        forceSync: true,
        spellChecker: false,
        status: false,
        onFullscreen: onFullscreen
      });

      window.simplemde.codemirror.on('change', () => {
        onChange &&
          onChange({
            text: window.simplemde.value(),
            formattedText: window.simplemde.options.previewRender(
              window.simplemde.value()
            )
          });
      });
    }
  }, []);
  return (
    <>
      <textarea id="markdownEditor"></textarea>
    </>
  );
};
