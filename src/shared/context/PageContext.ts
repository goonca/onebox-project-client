import React, { ReactNode } from 'react';
import { ModelObject } from 'shared/types/api-type';

export type PageContextProps = {
  menuOpen: boolean;
  editComponent?: {
    model: ModelObject;
    editor: ReactNode;
  };
};

export const PageContext = React.createContext<PageContextProps>({
  menuOpen: true
});
