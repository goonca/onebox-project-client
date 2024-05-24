import {
  faLeftRight,
  faLink,
  faPercent,
  faUpDown
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ComponentModel, FigureFitType } from 'shared/types/api-type';
import { ComponentEditorProps } from 'shared/types/ComponentEditorProps';

import { Spacing, SpacingReturn } from '../__parts/Spacing/Spacing';
import style from './Figure.module.scss';
import { SourceSelector } from './SourceSelector';

export const FigureEditor = (props: ComponentEditorProps) => {
  const [component, setComponent] = useState<ComponentModel>(
    props.component as ComponentModel
  );

  const [dialogOpened, setDialogOpened] = useState<boolean>(false);

  let comp = useRef<ComponentModel>(props.component as ComponentModel);
  const refCaption = useRef<HTMLTextAreaElement>(null);
  const refWidth = useRef<HTMLInputElement>(null);
  const refHeight = useRef<HTMLInputElement>(null);
  const refImage = useRef<HTMLImageElement>(null);
  const refObjFit = useRef<typeof RadioGroup>(null);

  const changeCaption = () => {
    const changes = {
      caption: refCaption.current?.value
    };
    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(comp.current);
  };

  const changeSpacing = ({ paddingTop, paddingBottom }: SpacingReturn) => {
    const changes = {
      paddingTop,
      paddingBottom
    };

    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(comp.current);
  };

  const changeObjFit = (_: any, fitType: string) => {
    const changes = { fitType: fitType as FigureFitType };

    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(comp.current);
  };

  const handleChangeSize = () => {
    const changes = {
      width: !!refWidth.current?.value
        ? Math.max(parseInt(refWidth.current?.value), 50)
        : undefined,
      height: !!refHeight.current?.value
        ? Math.min(parseInt(refHeight.current?.value), 1000)
        : undefined
    };

    comp.current = {
      ...comp.current,
      ...changes
    };

    props.onChange && props.onChange(comp.current);
  };

  const selectPicture = () => {
    setDialogOpened(true);
  };

  const handleConfirm = (key?: string) => {
    comp.current = {
      ...comp.current,
      key
    };

    refImage.current &&
      (refImage.current.src = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${comp.current?.key}`);

    props.onChange && props.onChange(comp.current);
    setDialogOpened(false);
  };

  const handleCancel = () => {
    setDialogOpened(false);
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/static/default-picture.svg';
  };

  useEffect(() => {
    refCaption.current &&
      (refCaption.current.value = props.component?.caption ?? '');
    setComponent(props.component as ComponentModel);
  }, [props.component?.id]);

  return (
    <>
      <div className={style['figure-editor']}>
        <div className={style['content']}>
          <div className={style['details']}>
            <div>
              <FormLabel id="image-source">Source</FormLabel>
              <div>
                <div className={style['source']} onClick={selectPicture}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${props.component?.key}`}
                    ref={refImage}
                    onError={handleError}
                    width={30}
                    height={30}
                    style={{ objectFit: 'cover' }}
                  ></img>
                  <label>click to select</label>

                  <FontAwesomeIcon icon={faLink} />
                </div>
              </div>
            </div>
            <div>
              <FormLabel id="image-caption">Caption</FormLabel>
              <div>
                <textarea ref={refCaption} onChange={changeCaption}></textarea>
              </div>
            </div>
          </div>
          <div className={style['other-properties']}>
            <div className={style['object-fit']}>
              <FormControl>
                <FormLabel>Object Fit</FormLabel>
                <RadioGroup
                  defaultValue={props.component?.fitType}
                  onChange={changeObjFit}
                  ref={refObjFit}
                >
                  <FormControlLabel
                    value="cover"
                    control={<Radio size="small" />}
                    label="Cover"
                  />
                  <FormControlLabel
                    value="fill"
                    control={<Radio size="small" />}
                    label="Fill"
                  />
                  {/*<FormControlLabel
                    value="scale-down"
                    control={<Radio size="small" />}
                    label="Scale down"
                  />
                  <FormControlLabel
                    value="contain"
                    control={<Radio size="small" />}
                    label="Contain"
                  />*/}
                  <FormControlLabel
                    value="none"
                    control={<Radio size="small" />}
                    label="None"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className={style['size']}>
              <FormControl>
                <FormLabel>Size</FormLabel>
                <label className={style['helper']}>
                  empty for original size
                </label>
                <div className={style['box']}>
                  <FontAwesomeIcon icon={faLeftRight} />
                  <input
                    ref={refWidth}
                    type="number"
                    min={50}
                    max={100}
                    step={10}
                    onChange={handleChangeSize}
                    defaultValue={component?.width}
                  />
                  <FontAwesomeIcon icon={faPercent} />
                </div>
                <div className={style['box']}>
                  <FontAwesomeIcon icon={faUpDown} />
                  <input
                    ref={refHeight}
                    type="number"
                    min={100}
                    max={500}
                    step={10}
                    onChange={handleChangeSize}
                    defaultValue={component?.height}
                  />
                  &nbsp;PX
                </div>
              </FormControl>
            </div>
          </div>
          <div className={style['spacing']}>
            <Spacing onChange={changeSpacing} component={component} />
          </div>
        </div>
      </div>
      <SourceSelector
        opened={dialogOpened}
        onCornfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
