import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

type Store = Record<string, unknown>;

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<Store>();

  run(store: Store, fn: () => any) {
    return this.als.run(store, fn);
  }

  set(key: string, value: unknown) {
    const store = this.als.getStore();
    if (!store) return;
    store[key] = value;
  }

  get<T = any>(key: string): T | undefined {
    const store = this.als.getStore();
    if (!store) return undefined;
    return store[key] as T;
  }
}
