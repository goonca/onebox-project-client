import {
  BlockModel,
  LayoutModel,
  ModelObject,
  SpaceModel
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
        ?.map((block, index) => ({ ...block }))
        .sort((a, b) => (a.positionY ?? 0) - (b.positionY ?? 0))
        .map((block, index) => ({ ...block, positionY: index }));
    })
    .reduce((flattenedArray, element) => {
      return flattenedArray?.concat(element ?? []);
    });

  return layout;
};

const compareId = <T extends ModelObject>(b1: T, b2: T) => {
  return (
    (b1.id !== undefined && b1.id == b2.id) ||
    (b1.tempId !== undefined && b1.tempId == b2.tempId)
  );
};