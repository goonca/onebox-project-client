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
  IconButton,
  Link,
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
  compareId,
  createEmptyFilter,
  defaultDisplay,
  updateDisplayOnBlock
} from 'shared/utils/spaceEditorUtils';
import style from './BlockEditor.module.scss';
import { BlockFilter } from './__parts/BlockFilter/BlockFilter';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleDisplayDelete = () => {
    if (!display) return;
    const newDisplays = block.displays
      ?.filter(_display => {
        return !!!compareId<DisplayModel>(_display, display);
      })
      .map((_display, position) => ({ ..._display, position }));

    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...block, displays: newDisplays }
    });

    setDisplay((newDisplays ?? [])[0]);
  };

  const handleChangeBlockProperty = (
    event: React.SyntheticEvent,
    property: string
  ) => {
    const value = (event.target as HTMLInputElement).value;
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: { ...block, [property]: value }
    });
  };

  const handleChangeDisplayProperty = (
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
    const newBlock = updateDisplayOnBlock(block, newDisplay);
    trigger(EventType.UPDATE_BLOCK_ON_LAYOUT, {
      block: newBlock
    });
    setDisplay(newDisplay);
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
    setDisplay((props.block.displays ?? [])[0]);
    setTabValue('1');
  }, [props.block.id]);

  useEffect(() => {
    setBlock(props.block);
  }, [props.block]);

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
                      {!!block?.filters?.length && (
                        <div className={style['filters-list']}>
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
                        </div>
                      )}
                      <div className={style['add-filter']}>
                        <Link onClick={handleAddFilter}>&nbsp;add filter</Link>
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
                      onChange={e => handleChangeBlockProperty(e, 'columns')}
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={block.columns ?? ''}
                    />
                  </div>
                  <div className={style['label']}>
                    <FormLabel>Max length</FormLabel>
                  </div>
                  <div className={style['max-length']}>
                    <FormControl>
                      <input
                        onChange={e => handleChangeBlockProperty(e, 'size')}
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={block.size ?? ''}
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
                            <ToggleButton
                              value={position}
                              key={`${display.position}-${display.id}`}
                            >
                              {position + 1}º
                            </ToggleButton>
                          );
                        })}
                    </ToggleButtonGroup>
                    &nbsp;
                    <Link onClick={handleAddDisplay}>&nbsp; add display</Link>
                  </div>
                </div>
                {display && (
                  <div ref={contentRef}>
                    <div
                      key={`${display.id}-${display.tempId}`}
                      className={style['content']}
                    >
                      <div className={style['badge-type']}>
                        <FormControl>
                          <FormLabel>Badge type</FormLabel>
                          <RadioGroup
                            defaultValue="hidden"
                            value={display.badgeType ?? ''}
                            onChange={e =>
                              handleChangeDisplayProperty(e, 'badgeType')
                            }
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
                                defaultValue={display.titleStyle}
                                size="small"
                                onChange={e =>
                                  handleChangeDisplayProperty(
                                    e as any,
                                    'titleStyle'
                                  )
                                }
                              >
                                <MenuItem value={undefined}>...</MenuItem>
                                {Object.keys(TextStyleEnum).map(key => {
                                  return (
                                    <MenuItem
                                      value={key}
                                      key={key}
                                      selected={display.titleStyle == key}
                                    >
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
                                  handleChangeDisplayProperty(e, 'titleCrop')
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
                                handleChangeDisplayProperty(
                                  e,
                                  'showHeadline',
                                  v => (!!v ? 1 : 0)
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
                                defaultValue={display.headlineStyle}
                                size="small"
                                onChange={e =>
                                  handleChangeDisplayProperty(
                                    e as any,
                                    'headlineStyle'
                                  )
                                }
                              >
                                <MenuItem value={undefined}>...</MenuItem>
                                {Object.keys(TextStyleEnum).map(key => {
                                  return (
                                    <MenuItem
                                      value={key}
                                      key={key}
                                      selected={display.headlineStyle == key}
                                    >
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
                                  handleChangeDisplayProperty(e, 'headlineCrop')
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
                    <div className={style['delete-button']}>
                      <IconButton
                        aria-label="delete"
                        onClick={handleDisplayDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
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
