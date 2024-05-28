import { NextApiRequest } from 'next';
import { LocationModel } from 'shared/types/api-type';

export type LocationProps = {
  getIp: (req: NextApiRequest) => string;
  getDistanceBetweenCitites: (from: LocationModel, to: LocationModel) => number;
};

export const useLocation = (): LocationProps => {
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

  return {
    getIp,
    getDistanceBetweenCitites
  };
};
