import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs
} from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { BlockModel, FilterModel } from 'shared/types/api-type';
import { createEmptyFilter } from 'shared/utils/spaceEditorUtils';
import style from './BlockEditor.module.scss';
import { BlockFilter } from './__parts/BlockFilter/BlockFilter';

type BlockEditorProps = {
  block: BlockModel;
};

export const BlockEditor: React.FC<BlockEditorProps> = (
  props: BlockEditorProps
) => {
  const { trigger } = useEvent();
  const [tabValue, setTabValue] = useState('1');

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

  const handleFilterDelete = (filter: FilterModel) => {
    trigger(EventType.DELETE_FILTER_ON_BLOCK, {
      filter: filter,
      block: props?.block
    });
  };

  const handleChangeColumns = (event: React.SyntheticEvent) => {
    const columns = (event.target as HTMLInputElement).value;
    console.log(columns);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...props?.block, columns }
    });
  };

  const handleChangeLength = (event: React.SyntheticEvent) => {
    const size = (event.target as HTMLInputElement).value;
    console.log(size);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...props?.block, size }
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div className={style['block-editor']}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              <Tab label="Filters" value="1" />
              <Tab label="Custom display" value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <div className={style['tab-filters']}>
              <div className={style['container']}>
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
                          onDelete={handleFilterDelete}
                        />
                      );
                    })}
                    <div className={style['add-filter']}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddFilter}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        &nbsp;add filter
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <div className={style['container']}>
                <div className={style['label']}>
                  <FormLabel>Columns</FormLabel>
                </div>
                <div className={style['columns']}>
                  <input
                    onChange={handleChangeColumns}
                    type="number"
                    min={1}
                    max={10}
                    value={props.block.columns}
                  />
                </div>
                <div className={style['label']}>
                  <FormLabel>Max length</FormLabel>
                </div>
                <div className={style['max-length']}>
                  <FormControl>
                    <input
                      onChange={handleChangeLength}
                      type="number"
                      min={1}
                      max={10}
                      value={props.block.size}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div>
              <div className={style['container']}>
                <div className={style['label']}>
                  <FormLabel>Custom Display</FormLabel>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
};
