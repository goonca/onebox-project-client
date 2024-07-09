import { NextApiRequest } from 'next';
import { IPLocation, LocationModel } from 'shared/types/api-type';
import { useServices } from './useServices';

export const IPAPI_KEY = 'jNXKxf32P1D6X4lsYh7uTLR7JEPxofsHCF8SoSBHB8TzguGrO3';
export const IPAPI_URI = 'https://ipapi.co';

export type ClientLocation = {
  ipLocation?: IPLocation;
  geoLocation?: LocationModel;
};

export type LocationProps = {
  getIp: (req: NextApiRequest) => string;
  getDistanceBetweenCitites: (from: LocationModel, to: LocationModel) => number;
  getClientLocation: (ipLocation?: IPLocation) => Promise<ClientLocation>;
};

export const useLocation = (): LocationProps => {
  const { getLocationByName, saveLocation } = useServices();

  const getIp = (req: NextApiRequest) => {
    let ipAddress = req.headers['x-forwarded-for'];
    console.log(ipAddress, req.connection.remoteAddress);
    return (ipAddress as string).split(',').pop() as string;
  };

  const getDistanceBetweenCitites = (
    from: LocationModel,
    to: LocationModel
  ): number => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(
      parseFloat(to.latitude as string) - parseFloat(from.latitude as string)
    ); // deg2rad below
    var dLon = deg2rad(
      parseFloat(to.longitude as string) - parseFloat(from.longitude as string)
    );
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(parseFloat(from.latitude as string))) *
        Math.cos(deg2rad(parseFloat(to.latitude as string))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  const getClientLocation = async (
    ipLocation?: IPLocation
  ): Promise<ClientLocation> => {
    if (!ipLocation) {
      const rawResponse = await fetch(`${IPAPI_URI}/json`);
      ipLocation = (await rawResponse.json()) as IPLocation;
    }

    let location: LocationModel;

    //@ts-ignore
    const locationResponse = await getLocationByName({
      name: ipLocation.city,
      longitude: ipLocation.longitude.toString(),
      latitude: ipLocation.latitude.toString()
    });

    location = locationResponse.data;

    if (!!!location.geoname_id) {
      //TODO: ERROR could not find the city on public.opendatasoft.com imported database
      //with the ip data coming from https://ipapi.co/
      //(maybe raising the range in km it works??)
      //to workaround with it i'm building manually the opendatasoft object
      console.debug(
        'could not find the city "' + ipLocation.city + '" on locations table'
      );
      location = {
        geoname_id: `X_${Math.random().toString(36).substr(2)}`,
        name: ipLocation.city,
        country: ipLocation.country_name,
        longitude: ipLocation.longitude.toString(),
        latitude: ipLocation.latitude.toString(),
        coordinates: { lon: ipLocation.longitude, lat: ipLocation.latitude }
      } as LocationModel;

      saveLocation(location);
      console.debug('saved location', location);
    }

    return { geoLocation: location, ipLocation } as ClientLocation;
  };

  return {
    getIp,
    getDistanceBetweenCitites,
    getClientLocation
  };
};
