import { LocationResponse } from 'shared/types/LocationResponse';
import { IPLocation } from 'shared/types/IPLocation';
import { NextApiRequest } from 'next';
import { LocationModel } from 'shared/types/api-type';

export type LocationProps = {
  getCurrentLocation: (ip: string) => Promise<IPLocation>;
  getCitiesByName: (name: string) => Promise<LocationResponse>;
  getCitiesNearby: (
    lon: string,
    lat: string,
    distanceInKm: number
  ) => Promise<LocationResponse>;
  getCityByNameAndLocation: (
    name: string,
    lon: string,
    lat: string
  ) => Promise<0 | LocationModel>;
  getIp: (req: NextApiRequest) => string;
  getDistanceBetweenCitites: (from: LocationModel, to: LocationModel) => number;
};

const IPAPI_KEY = 'jNXKxf32P1D6X4lsYh7uTLR7JEPxofsHCF8SoSBHB8TzguGrO3';
const IPAPI_URI = 'https://ipapi.co';

const OPEN_DATASOFT_URI =
  'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records';

export const useLocation = (): LocationProps => {
  //https://ipapi.co/8.8.8.8/json/
  //https://ipapi.co/8.8.8.8/json/?key=jNXKxf32P1D6X4lsYh7uTLR7JEPxofsHCF8SoSBHB8TzguGrO3
  //https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-500/records?where=name%20like%20%27astorga%27&limit=20

  const getIp = (req: NextApiRequest) => {
    let ipAddress = req.headers['x-forwarded-for'];
    console.log(ipAddress, req.connection.remoteAddress);
    return (ipAddress as string).split(',').pop() as string;
  };

  const getCitiesNearby = async (
    lon: string,
    lat: string,
    distanceInKm: number
  ) => {
    let response: LocationResponse;

    const rawResponse = await fetch(
      `${OPEN_DATASOFT_URI}?where=${encodeURIComponent(
        `within_distance(coordinates, GEOM'POINT(${lon} ${lat})', ${distanceInKm}km)`
      )}`
    );

    response = (await rawResponse.json()) as LocationResponse;
    //console.log('getCitiesAround()', response);
    return response;
  };

  const getCityByNameAndLocation = async (
    name: string,
    lon: string,
    lat: string
  ) => {
    let response: LocationResponse;

    const rawResponse = await fetch(
      `${OPEN_DATASOFT_URI}?where=${encodeURIComponent(
        `name = '${name}' AND within_distance(coordinates, GEOM'POINT(${lon} ${lat})', 50km)`
      )}`
    );

    response = (await rawResponse.json()) as LocationResponse;
    //console.log(`getCityByNameAndLocation(${name})`, response);
    return response?.results.length && response?.results[0];
  };

  const getCurrentLocation = async (ip: string): Promise<IPLocation> => {
    let location: IPLocation;

    const rawResponse = await fetch(
      process.env.NODE_ENV == 'production'
        ? `${IPAPI_URI}/${ip}/json?key=${IPAPI_KEY}`
        : `${IPAPI_URI}/json?key=${IPAPI_KEY}`
    );
    location = (await rawResponse.json()) as IPLocation;

    return location;
  };

  const getCitiesByName = async (name: string): Promise<LocationResponse> => {
    let response: LocationResponse;
    const rawResponse = await fetch(
      `${OPEN_DATASOFT_URI}?where=${encodeURIComponent(
        `name like '${name}*'`
      )}&limit=100`
    );
    response = (await rawResponse.json()) as LocationResponse;
    //console.log('getCitiesByName(' + name + ')', response);
    return response;
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

  return {
    getCurrentLocation,
    getCitiesByName,
    getIp,
    getCitiesNearby,
    getCityByNameAndLocation,
    getDistanceBetweenCitites
  };
};
