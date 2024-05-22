import { useTheme } from '@mui/material';
import { default as MaterialMediaQuery } from '@mui/material/useMediaQuery';

export type MediaQueryProps = {
  isMobile: () => boolean;
};
export const useMediaQuery = (): MediaQueryProps => {
  const theme = useTheme();
  const isMobile = () => MaterialMediaQuery(theme.breakpoints.down('md'));

  return { isMobile };
};
