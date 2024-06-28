import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput
} from '@mui/material';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { UserContext } from 'shared/context/UserContext';
import { useLocation } from 'shared/hooks/useLocation';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import { LocationModel } from 'shared/types/api-type';
import style from './ChangeRegionDialog.module.scss';

export type ChangeRegionProps = {
  open: boolean;
  onChange: (location: LocationModel) => void;
  onClose: () => void;
};

export const ChangeRegionDialog: React.FC<ChangeRegionProps> = ({
  open,
  onChange,
  onClose
}: ChangeRegionProps) => {
  const currentUser = useContext(UserContext);
  const { isMobile } = useMediaQuery();
  const { getDistanceBetweenCitites } = useLocation();
  const { getCitiesByName } = useServices();
  const [regionDialogOpened, setRegionDialogOpened] = useState<boolean>(false);
  const [cities, setCities] = useState<LocationModel[]>();
  const searchRef = useRef<HTMLInputElement>();

  const searchLocation = useCallback(
    debounce(() => listCities(), 500),
    []
  );

  const listCities = () => {
    if ((searchRef.current?.value?.length ?? 0) < 3) {
      setCities([]);
      return;
    }

    getCitiesByName(searchRef.current?.value as string).then(
      (res: OBResponseType) => {
        const cities = res.data as LocationModel[];
        console.log(cities, currentUser?.location);
        currentUser?.location &&
          cities.map(city => {
            city.distance = getDistanceBetweenCitites(
              city,
              currentUser?.location as LocationModel
            );
          });

        setCities(cities.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)));
      }
    );
  };

  const handleChangeRegion = (city: LocationModel) => {
    onChange && onChange(city);
  };

  const handleClose = () => {
    setCities([]);
    onClose && onClose();
  };

  useEffect(() => {
    setCities([]);
    setRegionDialogOpened(open);
  }, [open]);

  return (
    <Dialog
      fullScreen={isMobile()}
      open={regionDialogOpened}
      className={style['change-region-dialog']}
      maxWidth="md"
    >
      <DialogTitle>Change region</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className={style['wrapper']}>
            <div className={style['search-input']}>
              <OutlinedInput
                inputRef={searchRef}
                onChange={searchLocation}
                placeholder="City or region"
                startAdornment={
                  <>
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    &nbsp;&nbsp;
                  </>
                }
              />
            </div>
            {cities && !!cities.length && (
              <div className={style['grid-header']}>distance</div>
            )}
            {cities &&
              cities.map(city => (
                <div
                  className={style['city']}
                  onClick={() => handleChangeRegion(city)}
                >
                  <h3>{city.name}</h3>
                  <span className={style['country']}>{city.country}</span>
                  <span className={style['distance']}>
                    {parseInt((city.distance ?? 0) as unknown as string)} km
                  </span>
                </div>
              ))}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button variant="outlined" size="small" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
