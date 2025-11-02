export type ObfuscatorInfoItemsParams = {
  field: string;
  pattern: (param: string | number) => string;
};
export interface ObfuscatorInfoParams {
  params: unknown;
  fields?: ObfuscatorInfoItemsParams[];
}
