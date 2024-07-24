import {
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Checkbox,
  SelectChangeEvent,
  Box,
  IconButton
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { PageContext } from 'shared/context/PageContext';
import {
  BlockModel,
  FilterModel,
  SectionModel,
  UserModel
} from 'shared/types/api-type';
import style from './BlockFilter.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';

type BlockFilterProps = {
  block: BlockModel;
  filter: FilterModel;
  labeled?: boolean;
  onChange: (filter: FilterModel) => void;
  onDelete: (filter: FilterModel) => void;
};

type AttributeType = {
  name: string;
  type: string;
  operators: string[];
  options?: any[];
  labelKey?: string;
  freeSolo?: boolean;
};

export const BlockFilter: React.FC<BlockFilterProps> = (
  props: BlockFilterProps
) => {
  const pageContext = useContext(PageContext);
  const [sections, setSections] = useState<SectionModel[]>([]);
  const [labels, setLabels] = useState<{ label: string }[]>([]);
  const [filter, setFilter] = useState<FilterModel>(props.filter);
  const [writers, setWriters] = useState<UserModel[]>([]);
  const valueRef = useRef<HTMLInputElement>(null);

  const attributes: AttributeType[] = [
    {
      name: 'title',
      type: 'string',
      operators: ['substring', 'startsWith'],
      freeSolo: true
    },
    {
      name: 'headline',
      type: 'string',
      operators: ['substring', 'startsWith'],
      freeSolo: true
    },
    {
      name: 'section',
      type: 'section',
      operators: ['equals'],
      options: sections,
      labelKey: 'key'
    },
    //{ name: 'context', type: 'context', operators: ['equals'] },
    {
      name: 'author',
      type: 'author',
      operators: ['equals'],
      options: writers.map(writer => writer.username)
    },
    {
      name: 'label',
      type: 'string',
      operators: ['equals', 'substring'],
      options: labels.map(obj => obj.label)
    },
    {
      name: 'metter',
      type: 'metter',
      operators: ['equals', 'gt', 'lt'],
      options: [1, 2, 3, 4, 5]
    }
  ];

  const [selectedAttribute, setSelectedAttribute] = useState<
    AttributeType | undefined
  >(attributes.find(attribute => attribute.name == props?.filter.attribute));

  const handleChangeAttribute = (event: SelectChangeEvent<string>) => {
    const newAttribute = attributes.find(
      attribute => attribute.name == event.target.value
    );
    const hasOperator = !!newAttribute?.operators.find(
      operator => filter?.operator == operator
    );

    props?.onChange({
      ...filter,
      attribute: event.target.value,
      operator: !hasOperator ? '' : filter?.operator,
      value: ''
    });

    setSelectedAttribute(newAttribute);
  };

  const handleDeleteFilter = () => {
    props?.onDelete(filter);
  };

  const handleChangeActive = (event: SelectChangeEvent) => {
    props?.onChange({ ...filter, active: filter?.active == 1 ? 0 : 1 });
  };

  const handleChangeCondition = (event: SelectChangeEvent) => {
    props?.onChange({ ...filter, condition: event.target.value });
  };

  const handleChangeOperator = (event: SelectChangeEvent) => {
    props?.onChange({ ...filter, operator: event.target.value });
  };

  const handleChangeValue = (event: any) => {
    props?.onChange({ ...filter, value: event.target.value });
  };

  useEffect(() => {
    setSections(pageContext.sections);
  }, [pageContext.sections]);

  useEffect(() => {
    setLabels(pageContext.labels ?? []);
  }, [pageContext.labels]);

  useEffect(() => {
    setWriters(pageContext.writers ?? []);
  }, [pageContext.writers]);

  useEffect(() => {
    setFilter(props?.filter);
  }, [props?.filter]);

  return (
    <>
      {filter && (
        <div className={style['block-filter']} key={filter.id}>
          <Checkbox checked={!!filter.active} onChange={handleChangeActive} />
          <FormControl sx={{ m: 1, width: 70 }} size="small" className="input">
            {!!props?.labeled && (
              <label className={style['form-label']}>Condition</label>
            )}
            <Select
              displayEmpty
              defaultValue={filter.condition}
              onChange={handleChangeCondition}
            >
              <MenuItem value="and">and</MenuItem>
              <MenuItem value="or">or</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 100 }} size="small" className="input">
            {!!props?.labeled && (
              <label className={style['form-label']}>Property</label>
            )}
            <Select
              displayEmpty
              defaultValue={filter.attribute}
              onChange={handleChangeAttribute}
            >
              {attributes.map(attribute => (
                <MenuItem value={attribute.name} key={attribute.name}>
                  <span className="text-capitalize">{attribute.name}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 110 }} size="small" className="input">
            {!!props?.labeled && (
              <label className={style['form-label']}>Operator</label>
            )}
            <Select
              displayEmpty
              defaultValue={filter.operator}
              onChange={handleChangeOperator}
            >
              {selectedAttribute?.operators?.find(op => op == 'equals') && (
                <MenuItem value="equals">Equals</MenuItem>
              )}
              {selectedAttribute?.operators?.find(op => op == 'substring') && (
                <MenuItem value="substring">Contains</MenuItem>
              )}
              {selectedAttribute?.operators?.find(op => op == 'startsWith') && (
                <MenuItem value="startsWith">Starts with</MenuItem>
              )}
              {selectedAttribute?.operators?.find(op => op == 'gt') && (
                <MenuItem value="gt">Higher than</MenuItem>
              )}
              {selectedAttribute?.operators?.find(op => op == 'lt') && (
                <MenuItem value="lt">Lower than</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 150 }} className="input" id="teste">
            <>
              {!!props?.labeled && (
                <label className={style['form-label']}>Value</label>
              )}
              {selectedAttribute ? (
                <Autocomplete
                  defaultValue={filter.value}
                  freeSolo={!!selectedAttribute.freeSolo}
                  autoHighlight
                  options={(selectedAttribute.options as any) ?? []}
                  getOptionLabel={(obj: any) =>
                    selectedAttribute.labelKey &&
                    obj.hasOwnProperty(selectedAttribute.labelKey)
                      ? obj[selectedAttribute.labelKey]
                      : obj.toString()
                  }
                  renderInput={params => (
                    <TextField
                      autoComplete="off"
                      ref={valueRef}
                      {...params}
                      onChange={handleChangeValue}
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        autocomplete: 'new-password',
                        form: {
                          autocomplete: 'off'
                        }
                      }}
                    />
                  )}
                  renderOption={(props, obj) => {
                    //@ts-ignore
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        sx={{
                          '& > img': {
                            mr: 2,
                            flexShrink: 0
                          }
                        }}
                        {...optionProps}
                      >
                        {selectedAttribute.labelKey
                          ? (obj as any)[selectedAttribute.labelKey]
                          : obj}
                      </Box>
                    );
                  }}
                />
              ) : (
                <TextField
                  autoComplete="off"
                  onChange={handleChangeValue}
                  size="small"
                  inputProps={{
                    autocomplete: 'new-password',
                    form: {
                      autocomplete: 'off'
                    }
                  }}
                />
              )}
            </>
          </FormControl>
          <IconButton aria-label="delete" onClick={handleDeleteFilter}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </>
  );
};
