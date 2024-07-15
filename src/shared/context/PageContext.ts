import React, { ReactNode } from 'react';
import { ModelObject, SectionModel } from 'shared/types/api-type';

export type PageContextProps = {
  menuOpen: boolean;
  sections: SectionModel[];
  editComponent?: {
    model: ModelObject;
    editor: ReactNode;
  };
};

export const PageContext = React.createContext<PageContextProps>({
  menuOpen: true,
  sections: []
});
