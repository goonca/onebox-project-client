import React from 'react';
import { ComponentModel } from 'shared/types/api-type';

export type EditorContextProps = {
  maximized: boolean;
};

export const EditorContext = React.createContext<EditorContextProps>({
  maximized: false
});
