import getConfig from 'next/config';

export type EnvVars = {
  NODE_ENV?: string;
  APP_BASE_URL?: string;
};

export const useEnvVars = (): EnvVars => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
  //console.log(process.env);
  return {
    NODE_ENV:
      process.env.NODE_ENV ??
      publicRuntimeConfig.NODE_ENV ??
      serverRuntimeConfig.NODE_ENV,
    APP_BASE_URL:
      process.env.APP_BASE_URL ??
      publicRuntimeConfig.APP_BASE_URL ??
      serverRuntimeConfig.APP_BASE_URL
  };
};
