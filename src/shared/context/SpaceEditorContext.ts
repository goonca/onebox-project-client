import React from 'react';
import { SpaceModel } from 'shared/types/api-type';

export type SpaceEditorContextType = {
  space?: SpaceModel;
  editMode?: boolean;
  contrast?: number;
};

export const SpaceEditorContext = React.createContext<SpaceEditorContextType>(
  {}
);
