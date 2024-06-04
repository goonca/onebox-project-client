import { getCookie } from 'cookies-next';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';
import { IPLocation, LocationModel, UserModel } from 'shared/types/api-type';
import { useEffect, useState } from 'react';
import { StartPage } from 'pages/__dashboard/StartPage/StartPage';
import {
  ClientLocation,
  IPAPI_KEY,
  IPAPI_URI,
  useLocation
} from 'shared/hooks/useLocation';

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
}) satisfies GetServerSideProps<PageProps>;

const Page = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { updateUser, getLocationByName, saveLocation } = useServices();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserModel>(props.currentUser);
  const { getClientLocation } = useLocation();

  const getUserLocation = async () => {
    setLoading(true);

    const rawResponse = await fetch(`${IPAPI_URI}/json?key=${IPAPI_KEY}`);
    const ipLocation = (await rawResponse.json()) as IPLocation;

    if (ipLocation.city != currentUser.location?.name) {
      if (ipLocation.error) {
        //TODO: get from browser country
      }

      let { geoLocation: location } = (await getClientLocation(
        ipLocation
      )) as ClientLocation;

      if (!!location?.geoname_id) {
        currentUser &&
          updateUser(
            {
              locationGeonameId: location?.geoname_id
            } as UserModel,
            currentUser.authToken,
            true
          );
      }

      setCurrentUser({
        ...props.currentUser,
        location,
        locationGeonameId: location?.geoname_id
      });
    }

    setLoading(false);
    console.debug(currentUser);
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
