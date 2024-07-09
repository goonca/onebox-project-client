import { BlockModel, LayoutModel, SpaceModel } from 'shared/types/api-type';

export const addBlockToLayout = (
  layout: LayoutModel,
  position: { x: number; y: number }
) => {
  layout.blocks = layout.blocks ?? [];

  let allColumns = layout.columns?.split(',').map((column, index) => {
    return layout.blocks?.filter(block => block.positionX == index);
  });

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

export const moveBlockUp = (
  layout: LayoutModel,
  block: BlockModel
): LayoutModel | undefined => {
  if (block.positionY == 0) return;

  layout.blocks = layout.blocks?.map(b => {
    if (b.positionX == block.positionX) {
      if (b.positionY == (block.positionY as number) - 1) {
        b.positionY = b.positionY + 1;
        console.log('preview >', b.title, b.positionY);
        return b;
      }

      if (b.id == block.id || b.tempId == block.tempId) {
        b.positionY = (b.positionY as number) - 1;
        console.log('current > ', b.title, b.positionY);
        return b;
      }
    }

    return b;
  });

  console.log(layout.blocks);

  return sortedColumns(layout);
};

export const updateLayoutOnSpace = (
  space: SpaceModel,
  layout: LayoutModel
): SpaceModel => {
  return {
    ...space,
    layouts: space.layouts?.map(_layout => {
      return _layout.id == layout.id || _layout.tempId == layout.tempId
        ? layout
        : _layout;
    })
  };
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
