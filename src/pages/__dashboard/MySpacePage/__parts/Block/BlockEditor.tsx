import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import {
  BadgeTypeEnum,
  BlockModel,
  DisplayModel,
  FilterModel,
  TextStyleEnum
} from 'shared/types/api-type';
import {
  createEmptyFilter,
  defaultDisplay,
  updateDisplayOnBlock
} from 'shared/utils/spaceEditorUtils';
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
  const [display, setDisplay] = useState<DisplayModel>();
  const [block, setBlock] = useState<BlockModel>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const handleChangeDisplay = (
    event: React.MouseEvent<HTMLElement>,
    newIndex: string
  ) => {
    //console.log(newIndex);
    contentRef.current && (contentRef.current.style.transition = '');
    contentRef.current && (contentRef.current.style.opacity = '0');
    setDisplay(
      props.block.displays?.find(d => d.position?.toString() == newIndex)
    );
  };

  const handleAddFilter = () => {
    trigger(EventType.UPDATE_FILTER_ON_BLOCK, {
      filter: createEmptyFilter(block),
      block: block
    });
  };

  const handleFilterChange = (filter: FilterModel) => {
    trigger(EventType.UPDATE_FILTER_ON_BLOCK, {
      filter: filter,
      block: block
    });
  };

  const handleFilterDelete = (filter: FilterModel) => {
    trigger(EventType.DELETE_FILTER_ON_BLOCK, {
      filter: filter,
      block: block
    });
  };

  const handleChangeColumns = (event: React.SyntheticEvent) => {
    const columns = (event.target as HTMLInputElement).value;
    console.log(columns);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...block, columns }
    });
  };

  const handleChangeLength = (event: React.SyntheticEvent) => {
    const size = (event.target as HTMLInputElement).value;
    console.log(size);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...block, size }
    });
  };

  const handleChangeProperty = (
    event: React.SyntheticEvent,
    property: string,
    normalize?: (v: any) => any
  ) => {
    const target = event.target as any;
    const value = target.type == 'checkbox' ? target.checked : target.value;
    const newDisplay = {
      ...display,
      [property]: normalize ? normalize(value) : value
    };

    setDisplay(newDisplay);
    const newBlock = updateDisplayOnBlock(block, newDisplay);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: newBlock
    });
  };

  const handleAddDisplay = () => {
    const newDisplay = defaultDisplay(block);
    console.log('handleAddDisplay', newDisplay);
    const newBlock = updateDisplayOnBlock(block, newDisplay);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: newBlock
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    contentRef.current && (contentRef.current.style.opacity = '1');
    contentRef.current &&
      (contentRef.current.style.transition = 'opacity 0.3s');
  }, [display?.position]);

  useEffect(() => {
    setBlock(props.block);
    setDisplay(undefined);
    setTabValue('1');
  }, [props.block.id]);

  return (
    <>
      {block && (
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
                  {block && (
                    <>
                      {block?.filters?.map((filter, i) => {
                        return (
                          <BlockFilter
                            key={`${filter.id}-${filter.tempId}`}
                            block={block}
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
                      max={999}
                      value={block.columns}
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
                        value={block.size}
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className={style['tab-display']}>
                <div className={style['container']}>
                  <div className={style['position']}>
                    <ToggleButtonGroup
                      size="small"
                      color="primary"
                      value={display ? display.position : undefined}
                      exclusive
                      onChange={handleChangeDisplay}
                    >
                      {block.displays
                        ?.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                        .map(display => {
                          const position = display.position ?? 0;
                          return (
                            <ToggleButton value={position}>
                              {position + 1}º
                            </ToggleButton>
                          );
                        })}
                    </ToggleButtonGroup>
                    &nbsp;
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddDisplay}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>
                {display && (
                  <div className={style['content']} ref={contentRef}>
                    <div className={style['badge-type']}>
                      <FormControl>
                        <FormLabel>Badge type</FormLabel>
                        <RadioGroup
                          defaultValue="hidden"
                          value={display.badgeType ?? ''}
                          onChange={e => handleChangeProperty(e, 'badgeType')}
                        >
                          <FormControlLabel
                            value={BadgeTypeEnum.HIDDEN}
                            control={<Radio />}
                            label="Hidden"
                          />
                          <FormControlLabel
                            value={BadgeTypeEnum.BLOCK}
                            control={<Radio />}
                            label="Block"
                          />
                          <FormControlLabel
                            value={BadgeTypeEnum.LINE}
                            control={<Radio />}
                            label="Line"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className={style['title']}>
                      <FormControl>
                        <FormLabel>Title</FormLabel>
                      </FormControl>
                      <div className={style['wrapper']}>
                        <div>
                          <div>
                            <label className={style['sub-label']}>Font</label>
                          </div>
                          <div className={style['font']}>
                            <Select
                              displayEmpty
                              value={display.titleStyle}
                              size="small"
                              onChange={e =>
                                handleChangeProperty(e as any, 'titleStyle')
                              }
                            >
                              <MenuItem value={undefined}>...</MenuItem>
                              {Object.keys(TextStyleEnum).map(key => {
                                return (
                                  <MenuItem value={key}>
                                    <span
                                      style={{
                                        fontSize: (TextStyleEnum as any)[key]
                                      }}
                                    >
                                      {(TextStyleEnum as any)[key]}
                                    </span>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                        <div>
                          <div>
                            <label className={style['sub-label']}>Crop</label>
                          </div>
                          <div className={style['crop']}>
                            <input
                              onChange={e =>
                                handleChangeProperty(e, 'titleCrop')
                              }
                              type="number"
                              min={1}
                              max={999}
                              value={display.titleCrop ?? ''}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={style['headline']}>
                      <FormControl>
                        <FormLabel>
                          <Checkbox
                            size="small"
                            checked={display.showHeadline == 1}
                            value={display.showHeadline}
                            onChange={e =>
                              handleChangeProperty(e, 'showHeadline', v =>
                                !!v ? 1 : 0
                              )
                            }
                          />
                          &nbsp;Show headline
                        </FormLabel>
                      </FormControl>
                      <div className={style['wrapper']}>
                        <div>
                          <div>
                            <label className={style['sub-label']}>Font</label>
                          </div>
                          <div className={style['font']}>
                            <Select
                              displayEmpty
                              size="small"
                              onChange={e =>
                                handleChangeProperty(e as any, 'headlineStyle')
                              }
                            >
                              <MenuItem value={undefined}>...</MenuItem>
                              {Object.keys(TextStyleEnum).map(key => {
                                return (
                                  <MenuItem value={key}>
                                    <span
                                      style={{
                                        fontSize: (TextStyleEnum as any)[key]
                                      }}
                                    >
                                      {(TextStyleEnum as any)[key]}
                                    </span>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </div>
                        </div>
                        <div>
                          <div>
                            <label className={style['sub-label']}>Crop</label>
                          </div>
                          <div className={style['crop']}>
                            <input
                              onChange={e =>
                                handleChangeProperty(e, 'headlineCrop')
                              }
                              type="number"
                              min={1}
                              max={999}
                              value={display.headlineCrop ?? ''}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabContext>
        </div>
      )}
    </>
  );
};
