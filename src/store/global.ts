import CacheLocalStorage from '@codigex/cachestorage';

export const appProvider = 'app';

export const appCachestorage = new CacheLocalStorage({
  namespace: appProvider,
  // 1 year cache duration in seconds
  cacheDuration: 60 * 60 * 24 * 365
});

export const storeAPIkey = (key: string) => {
  return appCachestorage.setItem<string>('API_key', `${key}`);
};

export const getAPIkey = async () => {
  const result = await appCachestorage.getItem<string>('API_key');
  return result.data||'';
};
