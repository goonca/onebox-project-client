import {
  BadgeTypeEnum,
  BlockModel,
  DisplayModel,
  FilterModel,
  IdType,
  LayoutModel,
  ModelObject,
  SpaceModel,
  TextStyleEnum
} from 'shared/types/api-type';

export const addBlockToLayout = (
  layout: LayoutModel,
  position: { x: number; y: number }
) => {
  layout.blocks = layout.blocks ?? [];

  let allColumns = findLayoutColumns(layout);

  allColumns &&
    allColumns[position.x]?.splice(position.y, 0, {
      tempId: Math.random().toString(36).substr(2),
      positionX: position.x,
      positionY: position.y
    });

  allColumns = allColumns?.map(blocks => {
    return blocks
      ?.map((block, index) => ({ ...block, positionY: index }))
      .sort((a, b) => a.positionY - b.positionY);
  });

  const newBlocks: BlockModel[] =
    allColumns?.reduce((flattenedArray, element) => {
      return flattenedArray?.concat(element ?? []);
    }) ?? [];

  layout.blocks = newBlocks;

  return layout;
};

export const deleteBlock = (
  layout: LayoutModel,
  block: BlockModel
): LayoutModel | undefined => {
  layout.blocks = layout.blocks?.filter(b => !compareId<BlockModel>(b, block));
  return layout;
};

export const moveBlockUp = (
  layout: LayoutModel,
  block: BlockModel
): LayoutModel | undefined => {
  if (block.positionY == 0) return;

  layout.blocks = layout.blocks?.map(b => {
    if (b.positionX == block.positionX) {
      if (b.positionY == (block.positionY as number) - 1) {
        b.positionY = b.positionY + 1;
        return b;
      }

      if (compareId<BlockModel>(b, block)) {
        b.positionY = (b.positionY as number) - 1;
        return b;
      }
    }

    return b;
  });

  return sortedColumns(layout);
};

export const moveBlockDown = (
  layout: LayoutModel,
  block: BlockModel
): LayoutModel | undefined => {
  const columns = findLayoutColumns(layout);
  if (
    columns &&
    (block.positionY as number) >= columns[block.positionX ?? 0].length - 1
  ) {
    return;
  }

  //first needs to find the next block
  layout.blocks = layout.blocks?.map(b => {
    if (b.positionX == block.positionX) {
      if (b.positionY == (block.positionY as number) + 1) {
        b.positionY = b.positionY - 1;
        return b;
      }
    }
    return b;
  });
  //then thr current block
  layout.blocks = layout.blocks?.map(b => {
    if (b.positionX == block.positionX) {
      if (compareId<BlockModel>(b, block)) {
        b.positionY = (b.positionY as number) + 1;
        return b;
      }
    }
    return b;
  });

  return sortedColumns(layout);
};

export const updateLayoutOnSpace = (
  space: SpaceModel,
  layout: LayoutModel
): SpaceModel => {
  return {
    ...space,
    layouts: space.layouts?.map(_layout => {
      return compareId<LayoutModel>(_layout, layout) ? layout : _layout;
    })
  };
};

const findLayoutColumns = (
  layout: LayoutModel
): Array<BlockModel[]> | undefined => {
  return layout.columns?.split(',').map((column, index) => {
    return layout.blocks?.filter(block => block.positionX == index);
  }) as Array<BlockModel[]>;
};

const sortedColumns = (layout: LayoutModel): LayoutModel => {
  layout.blocks = layout.columns
    ?.split(',')
    .map((column, index) => {
      return layout.blocks?.filter(block => block.positionX == index);
    })
    .map(blocks => {
      return blocks
        ?.map(block => ({ ...block }))
        .sort((a, b) => (a.positionY ?? 0) - (b.positionY ?? 0))
        .map((block, index) => ({ ...block, positionY: index }));
    })
    .reduce((flattenedArray, element) => {
      return flattenedArray?.concat(element ?? []);
    });

  return layout;
};

export const compareId = <T extends ModelObject>(b1: T, b2: T) => {
  return (
    (b1.id !== undefined && b1.id == b2.id) ||
    (b1.tempId !== undefined && b1.tempId == b2.tempId)
  );
};

export const findLayoutByBlock = (space: SpaceModel, block: BlockModel) => {
  //console.log('findLayoutByBlock', space, block);
  const newLayout = space.layouts?.find(layout =>
    compareId(
      layout.blocks?.find(_block => compareId(block, _block)) ?? {},
      block
    )
  );

  //console.log(newLayout);
  return newLayout;
};

export const updateBlockOnLayout = (
  layout: LayoutModel,
  block: BlockModel
): LayoutModel => {
  let updated = false;
  layout.blocks = layout.blocks?.map(_block => {
    if (!updated && compareId<BlockModel>(_block, block)) {
      updated = true;
      return block;
    }
    return _block;
  });

  !updated && layout.blocks?.push(block);
  //console.log('updateBlockOnLayout', layout);
  return layout;
};

export const updateFilterOnBlock = (
  block: BlockModel,
  filter: FilterModel
): BlockModel => {
  let updated = false;
  block.filters = block.filters ?? [];
  block.filters = block.filters?.map(_filter => {
    if (!updated && compareId<FilterModel>(_filter, filter)) {
      updated = true;
      return filter;
    }
    return _filter;
  });

  !updated && block.filters?.push(filter);
  return block;
};

export const deleteFilterOnBlock = (
  block: BlockModel,
  filter: FilterModel
): BlockModel => {
  block.filters = block.filters?.filter(_filter => {
    return !compareId<FilterModel>(_filter, filter);
  });

  return block;
};

export const updateDisplayOnBlock = (
  block: BlockModel,
  display: DisplayModel
): BlockModel => {
  let updated = false;
  block.displays = block.displays ?? [];
  block.displays = block.displays?.map(_display => {
    if (!updated && compareId<DisplayModel>(_display, display)) {
      updated = true;
      return display;
    }
    return _display;
  });

  !updated && block.displays?.push(display);
  return block;
};
export const createEmptyFilter = (block: BlockModel): FilterModel => {
  return {
    tempId: Math.random().toString(36).substr(2),
    blockId: block.id ?? block.tempId,
    condition: 'or',
    attribute: 'title',
    operator: 'startsWith',
    active: 0
  };
};

export const defaultDisplay = (block?: BlockModel) => ({
  tempId: Math.random().toString(36).substr(2),
  blockId: block ? block.id : undefined,
  block: block,
  active: 0,
  position: block ? (block.displays ?? []).length : 0,
  badgeType: BadgeTypeEnum.HIDDEN
});
