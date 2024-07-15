import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { BlockModel, FilterModel } from 'shared/types/api-type';
import { createEmptyFilter } from 'shared/utils/spaceEditorUtils';
import style from './Block.module.scss';
import { BlockFilter } from './__parts/BlockFilter/BlockFilter';

type BlockEditorProps = {
  block: BlockModel;
};

export const BlockEditor: React.FC<BlockEditorProps> = (
  props: BlockEditorProps
) => {
  const { trigger } = useEvent();

  const handleAddFilter = () => {
    trigger(EventType.UPDATE_FILTER_ON_BLOCK, {
      filter: createEmptyFilter(props?.block),
      block: props?.block
    });
  };

  const handleFilterChange = (filter: FilterModel) => {
    trigger(EventType.UPDATE_FILTER_ON_BLOCK, {
      filter: filter,
      block: props?.block
    });
  };

  return (
    <>
      <div className={style['block-editor']}>
        {props.block && (
          <>
            {props?.block?.filters?.map((filter, i) => {
              return (
                <BlockFilter
                  key={`${filter.id}-${filter.tempId}`}
                  block={props.block}
                  filter={filter}
                  labeled={i == 0}
                  onChange={handleFilterChange}
                />
              );
            })}
            <Button variant="outlined" size="small" onClick={handleAddFilter}>
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;add filter
            </Button>
          </>
        )}
      </div>
    </>
  );
};
