import {
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Checkbox,
  SelectChangeEvent,
  debounce,
  getListItemAvatarUtilityClass
} from '@mui/material';
import { Badge } from 'components/compose/Badge';
import { useContext, useEffect, useRef, useState } from 'react';
import { PageContext } from 'shared/context/PageContext';
import { BlockModel, FilterModel, SectionModel } from 'shared/types/api-type';
import style from './BlockFilter.module.scss';

type BlockFilterProps = {
  block: BlockModel;
  filter: FilterModel;
  labeled?: boolean;
  onChange: (filter: FilterModel) => void;
};

type AttributeType = {
  name: string;
  type: string;
  operators: string[];
};

export const BlockFilter: React.FC<BlockFilterProps> = (
  props?: BlockFilterProps
) => {
  const attributes: AttributeType[] = [
    { name: 'title', type: 'string', operators: ['substring', 'startsWith'] },
    {
      name: 'headline',
      type: 'string',
      operators: ['substring', 'startsWith']
    },
    { name: 'section', type: 'section', operators: ['equals'] },
    { name: 'context', type: 'context', operators: ['equals'] },
    { name: 'author', type: 'author', operators: ['equals'] },
    { name: 'label', type: 'string', operators: ['equals'] },
    { name: 'metter', type: 'metter', operators: ['equals', 'gt', 'lt'] }
  ];

  const pageContext = useContext(PageContext);
  const [sections, setSections] = useState<SectionModel[]>([]);
  const [filter, setFilter] = useState<FilterModel | undefined>(props?.filter);

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

  /*useEffect(() => {
    const newFilter: FilterModel = { ...filter, value: '' };
    const hasOperator = !!selectedAttribute?.operators.find(
      operator => filter?.operator == operator
    );

    console.log('selectedAttribute', selectedAttribute);

    if (!hasOperator) {
      console.log('resetOperator');
      newFilter.operator = '';
    }
    console.log('to send **', newFilter);
    props?.onChange(newFilter);
    //console.log('hasOperator', hasOperator);
  }, [props?.filter.attribute]);*/

  useEffect(() => {
    setSections(pageContext.sections);
  }, [pageContext.sections]);

  useEffect(() => {
    console.log('props?.filter', props?.filter);
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
          <FormControl sx={{ m: 1, width: 110 }} className="input" id="teste">
            <>
              {!!props?.labeled && (
                <label className={style['form-label']}>Value</label>
              )}
              {(() => {
                switch (selectedAttribute?.type) {
                  case 'section':
                    return (
                      <Select
                        onChange={handleChangeValue}
                        renderValue={value => {
                          console.log(value);
                          return (
                            <Badge
                              style={{ fontSize: '8px', margin: '0 -15px' }}
                              section={sections.find(
                                section => section.id == value
                              )}
                            />
                          );
                        }}
                      >
                        {sections.map(section => {
                          return (
                            <MenuItem value={section.id}>
                              <Badge section={section} key={section.id} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    );
                  case 'metter':
                    return (
                      <input
                        onChange={handleChangeValue}
                        type="number"
                        min={0}
                        max={5}
                        value={filter.value}
                      />
                    );
                  case 'author':
                    return (
                      <Autocomplete
                        freeSolo
                        defaultValue={filter.value}
                        options={['a', 'b'].map(option => option)}
                        renderInput={params => (
                          <TextField
                            onChange={handleChangeValue}
                            {...params}
                            size="small"
                          />
                        )}
                        renderOption={props => {
                          return (
                            <li key={(props as any).key}>
                              {(props as any).key}
                            </li>
                          );
                        }}
                      />
                    );
                  default:
                    return (
                      <TextField
                        onChange={handleChangeValue}
                        variant="outlined"
                        defaultValue={filter.value}
                      />
                    );
                }
              })()}
            </>
          </FormControl>
        </div>
      )}
    </>
  );
};
