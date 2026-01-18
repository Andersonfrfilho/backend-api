export interface CacheProviderInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  setEncrypted<T>(key: string, value: T, ttl?: number): Promise<void>;
  getDecrypted<T>(key: string): Promise<T | null>;
}
