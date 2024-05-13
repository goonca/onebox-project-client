import React from 'react';

export type EditorContextProps = {
  maximized: boolean;
};

export const EditorContext = React.createContext<EditorContextProps>({
  maximized: true
});
