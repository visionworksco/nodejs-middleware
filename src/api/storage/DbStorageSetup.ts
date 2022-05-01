export interface DbStorageSetup {
  create(): Promise<void>;
  delete(): Promise<void>;
}
