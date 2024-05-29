import { getCookie } from 'cookies-next';
//import { StartPage } from 'src/pages/__dashboard/StartPage/StartPage';
import dynamic from 'next/dynamic';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';
import { IPLocation, LocationModel, UserModel } from 'shared/types/api-type';
import { useEffect, useState } from 'react';
import { StartPage } from 'pages/__dashboard/StartPage/StartPage';

/*const StartPage = dynamic<PageProps>(
  () =>
    import('src/pages/__dashboard/StartPage/StartPage').then(
      mod => mod.StartPage
    ),
  { ssr: false }
);*/

export const getServerSideProps = (async ({ req, res }) => {
  const { authenticate } = useServices();

  const authToken = getCookie('authToken', { req, res });
  const authResponse = await authenticate({
    authToken
  });

  const currentUser = authResponse.data;

  if (!currentUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    };
  }

  return { props: { currentUser } };
}) satisfies GetServerSideProps<{ currentUser: PageProps }>;

const Page = ({
  currentUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { updateUser, getLocationByName, getClientIp } = useServices();
  const [loading, setLoading] = useState<boolean>(true);

  const IPAPI_KEY = 'jNXKxf32P1D6X4lsYh7uTLR7JEPxofsHCF8SoSBHB8TzguGrO3';
  const IPAPI_URI = 'https://ipapi.co';

  const getUserLocation = async () => {
    setLoading(true);

    const rawResponse = await fetch(`${IPAPI_URI}/json?key=${IPAPI_KEY}`);
    const ipLocation = (await rawResponse.json()) as IPLocation;

    console.log('ipLocation', ipLocation);
    if (ipLocation.error) {
      //TODO: get from browser country
    }
    const locationResponse = await getLocationByName({
      name: ipLocation.city,
      longitude: ipLocation.longitude.toString(),
      latitude: ipLocation.latitude.toString()
    });

    let location = locationResponse.data;

    console.log(location);

    if (!!location && Object.values(location).length === 0) {
      //TODO: ERROR could not find the city on public.opendatasoft.com imported database
      //with the ip data coming from https://ipapi.co/
      //(maybe raising the range in km it works??)
      //to workaround with it i'm building manually the opendatasoft object
      console.log(
        'could not find the city "' + ipLocation.city + '" on locations table'
      );
      location = {
        name: ipLocation.city,
        country: ipLocation.country_name,
        longitude: ipLocation.longitude.toString(),
        latitude: ipLocation.latitude.toString(),
        coordinates: { lon: ipLocation.longitude, lat: ipLocation.latitude }
      } as LocationModel;
    }

    currentUser = { ...currentUser, location };

    await updateUser(
      {
        locationGeonameId: location.geoname_id
      } as UserModel,
      currentUser.authToken
    );

    setLoading(false);
    console.log(currentUser);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/static/externals/simplemde.min.css" />
      <script src="/static/externals/simplemde.min.js" defer></script>
      {loading ? <></> : <StartPage currentUser={currentUser} />}
    </>
  );
};

export default Page;
