import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
  Checkbox
} from '@mui/material';
import { BlockModel, FilterModel } from 'shared/types/api-type';
import style from './BlockFilter.module.scss';

type BlockFilterProps = {
  block: BlockModel;
  filter: FilterModel;
  labeled?: boolean;
};

export const BlockFilter: React.FC<BlockFilterProps> = (
  props?: BlockFilterProps
) => {
  return (
    <>
      <div className={style['block-filter']} key={props?.filter.id}>
        <Checkbox checked={!!props?.filter.active} />
        <FormControl sx={{ m: 1, width: 70 }} size="small" className="input">
          {!!props?.labeled && (
            <label className={style['form-label']}>Condition</label>
          )}
          <Select displayEmpty defaultValue={props?.filter.condition}>
            <MenuItem value="and">and</MenuItem>
            <MenuItem value="or">or</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 100 }} size="small" className="input">
          {!!props?.labeled && (
            <label className={style['form-label']}>Property</label>
          )}
          <Select displayEmpty defaultValue={props?.filter.attribute}>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="headline">Headline</MenuItem>
            <MenuItem value="section">Section</MenuItem>
            <MenuItem value="context">Context</MenuItem>
            <MenuItem value="userId">Author</MenuItem>
            <MenuItem value="hashtag">Hashtag</MenuItem>
            <MenuItem value="matter">Matter</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 110 }} size="small" className="input">
          {!!props?.labeled && (
            <label className={style['form-label']}>Operator</label>
          )}
          <Select displayEmpty defaultValue={props?.filter.operator}>
            <MenuItem value="xxx">Equals</MenuItem>
            <hr />
            <MenuItem value="substring">Contains</MenuItem>
            <MenuItem value="startsWith">Starts with</MenuItem>
            <MenuItem value="gt">Higher than</MenuItem>
            <MenuItem value="lt">Lower than</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 110 }} className="input" id="teste">
          {!!props?.labeled && (
            <label className={style['form-label']}>Value</label>
          )}
          <Autocomplete
            freeSolo
            defaultValue={props?.filter.value}
            options={['a', 'b'].map(option => option)}
            renderInput={params => <TextField {...params} size="small" />}
            renderOption={(props, option) => {
              return <li key={(props as any).key}>{(props as any).key}</li>;
            }}
          />
        </FormControl>
      </div>
    </>
  );
};
