import React, { ReactNode } from 'react';
import { ModelObject, SectionModel } from 'shared/types/api-type';

export type PageContextProps = {
  menuOpen: boolean;
  popoverOpen: boolean;
  sections: SectionModel[];
  editComponent?: {
    model: ModelObject;
    editor: ReactNode;
  };
  labels?: { label: string }[];
};

export const PageContext = React.createContext<PageContextProps>({
  menuOpen: true,
  popoverOpen: false,
  sections: []
});
