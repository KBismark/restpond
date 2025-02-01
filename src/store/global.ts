import CacheLocalStorage from '@codigex/cachestorage';


export const appProvider = 'app';

//
export const appCachestorage = new CacheLocalStorage({
  namespace: appProvider,
  // 1 year cache duration in seconds
  cacheDuration: 60 * 60 * 24 * 365
});


