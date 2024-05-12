import getConfig from 'next/config';

export type EnvVars = {
  NODE_ENV?: string;
  STORYBOOK_NODE_ENV?: string;
  NEXT_PUBLIC_APP_BASE_URL?: string;
};

export const useEnvVars = (): EnvVars => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
  //console.log(process.env);
  return {
    NODE_ENV:
      process.env.NODE_ENV ??
      publicRuntimeConfig.NODE_ENV ??
      serverRuntimeConfig.NODE_ENV,
    STORYBOOK_NODE_ENV:
      process.env.STORYBOOK_NODE_ENV ??
      publicRuntimeConfig.STORYBOOK_NODE_ENV ??
      serverRuntimeConfig.STORYBOOK_NODE_ENV,
    NEXT_PUBLIC_APP_BASE_URL:
      process.env.NEXT_PUBLIC_APP_BASE_URL ??
      publicRuntimeConfig.NEXT_PUBLIC_APP_BASE_URL ??
      serverRuntimeConfig.NEXT_PUBLIC_APP_BASE_URL
  };
};
