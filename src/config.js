let LIVE_BACKEND_URL = 'https://api.app.wearesiml.com/public/increment/v1';
let DEV_BACKEND_URL = 'http://192.168.8.109:8000/increment/v1';
let isDev = false;
let BACKEND_URL = isDev ? DEV_BACKEND_URL : LIVE_BACKEND_URL;
export default {
  IS_DEV: BACKEND_URL,
  BACKEND_URL: BACKEND_URL,
  TEST: false,
  GOOGLE: {
    API_KEY: 'AIzaSyDrRdwTpaLeofZGsv39i0OuMpDLiIQJIIk',
  },
  PUSHER: {
    appId: '1079335',
    key: 'fcc878c9ae95355398a8',
    secret: 'd5e212f122e005bd91ef',
    cluster: 'ap1',
    encrypted: true,
  },
  versionChecker: 'store',
  retrieveDataFlag: 1
};
