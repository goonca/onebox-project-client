import getConfig from 'next/config';

export type EnvVars = {
  NODE_ENV?: string;
  STORYBOOK_NODE_ENV?: string;
  REACT_APP_BASE_URL?: string;
};

export const useEnvVars = (): EnvVars => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

  return {
    NODE_ENV:
      process.env.NODE_ENV ??
      publicRuntimeConfig.NODE_ENV ??
      serverRuntimeConfig.NODE_ENV,
    STORYBOOK_NODE_ENV:
      process.env.STORYBOOK_NODE_ENV ??
      publicRuntimeConfig.STORYBOOK_NODE_ENV ??
      serverRuntimeConfig.STORYBOOK_NODE_ENV,
    REACT_APP_BASE_URL:
      process.env.REACT_APP_BASE_URL ??
      publicRuntimeConfig.REACT_APP_BASE_URL ??
      serverRuntimeConfig.REACT_APP_BASE_URL
  };
};
