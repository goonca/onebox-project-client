import React, { ReactNode } from 'react';
import { ModelObject, SectionModel, UserModel } from 'shared/types/api-type';

export type PageContextProps = {
  menuOpen: boolean;
  popoverOpen: boolean;
  sections: SectionModel[];
  editComponent?: {
    model: ModelObject;
    editor: ReactNode;
  };
  labels?: { label: string }[];
  writers?: UserModel[];
};

export const PageContext = React.createContext<PageContextProps>({
  menuOpen: true,
  popoverOpen: false,
  sections: [],
  writers: []
});
