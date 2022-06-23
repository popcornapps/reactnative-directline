enum AppEnv {
  PROD = 'PROD',
  DEV = 'DEV',
}

const AppEnvironment = AppEnv.DEV;

const commonConfig = {
  REFRESH_TOKEN_TIMEOUT: 1700000,
};

const prodConfig = {
  ...commonConfig,
  API_BASE_URL: 'https://directline.botframework.com/v3/directline',
};

const developmentConfig = {
  ...commonConfig,
  API_BASE_URL: 'https://directline.botframework.com/v3/directline',
};

const AppConfig =
  AppEnvironment === AppEnv.DEV
    ? developmentConfig
    : AppEnvironment === AppEnv.PROD
    ? prodConfig
    : prodConfig;

export { AppConfig, AppEnvironment, AppEnv };
