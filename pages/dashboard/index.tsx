import { getCookie } from 'cookies-next';
//import { StartPage } from 'src/pages/__dashboard/StartPage/StartPage';
import dynamic from 'next/dynamic';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useLocation } from 'shared/hooks/useLocation';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';
import { NextApiRequest } from 'next';
import { LocationModel, UserModel } from 'shared/types/api-type';

const StartPage = dynamic<PageProps>(
  () =>
    import('src/pages/__dashboard/StartPage/StartPage').then(
      mod => mod.StartPage
    ),
  { ssr: false }
);

export const getServerSideProps = (async ({ req, res }) => {
  const { authenticate, saveLocation, updateUser } = useServices();
  const { getCurrentLocation, getIp, getCityByNameAndLocation } = useLocation();

  const authToken = getCookie('authToken', { req, res });
  const authResponse = await authenticate({
    authToken
  });

  console.log('authResponse.data', authResponse.data);

  let clientIp = await getIp(req as NextApiRequest);

  const ipLocation = await getCurrentLocation(clientIp);
  let location = await getCityByNameAndLocation(
    ipLocation.city,
    ipLocation.longitude.toString(),
    ipLocation.latitude.toString()
  );

  if (!location) {
    //TODO: ERROR could not find the city on public.opendatasoft.com by getCityByNameAndLocation()
    //with the ip data coming from https://ipapi.co/
    //(maybe raising the range in km it works??)
    //to workaround with it i'm building manually the opendatasoft object
    console.error(
      'ERROR could not find the city on public.opendatasoft.com by getCityByNameAndLocation()'
    );
    location = {
      name: ipLocation.city,
      country: ipLocation.country_name,
      longitude: ipLocation.longitude.toString(),
      latitude: ipLocation.latitude.toString(),
      coordinates: { lon: ipLocation.longitude, lat: ipLocation.latitude }
    } as LocationModel;
  }

  const locationResponse = await saveLocation(location);

  const currentUser = { ...authResponse.data, location };
  console.log(
    'getCurrentLocation',
    location.geoname_id,
    currentUser.locationId
  );

  await updateUser(
    {
      locationId: location.geoname_id
    } as UserModel,
    authToken
  );

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
  return (
    <>
      <link rel="stylesheet" href="/static/externals/simplemde.min.css" />
      <script src="/static/externals/simplemde.min.js" defer></script>
      <StartPage currentUser={currentUser} />;
    </>
  );
};

export default Page;
