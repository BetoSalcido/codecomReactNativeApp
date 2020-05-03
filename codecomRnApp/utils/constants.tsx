import Constants from "expo-constants";

export enum ENVIRONMENTS {
  LOCAL ='LOCAL',
  DEV ='DEVELOPMENT',
  STAGING ='STAGING',
  QA ='QA',
  PROD ='PROD',
}

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENVIRONMENTS.LOCAL
  if (env.indexOf('dev') !== -1) return ENVIRONMENTS.DEV
  if (env.indexOf('qa') !== -1) return ENVIRONMENTS.QA
  if (env.indexOf('stg') !== -1) return ENVIRONMENTS.STAGING
  if (env.indexOf('prod') !== -1) return ENVIRONMENTS.PROD
}
export const RELEASE_ENVIRONMENT = getEnvVars(Constants.manifest.releaseChannel)

const getApiBaseUrl = function() {
 let apiBaseUrl = 'http://192.168.1.69:5000';
 switch (RELEASE_ENVIRONMENT) {
   case ENVIRONMENTS.DEV:
    apiBaseUrl = "https://dev-services.laffy.co";
     break;
   case ENVIRONMENTS.QA:
    apiBaseUrl = "https://test-services.laffy.co"
    break;
   case ENVIRONMENTS.STAGING:
    apiBaseUrl = "https://stg-services.laffy.co"
    break;
   case ENVIRONMENTS.PROD:
    apiBaseUrl = "https://services.laffy.co";
    break;
   default:
     break;
 }
 return apiBaseUrl
}
export const API_BASE_URL = getApiBaseUrl()
