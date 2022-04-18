export interface AmpqSocketOptions {
  rejectUnauthorized: boolean;
  noDelay: boolean;
  cert: Buffer;
  key: Buffer;
  ca: [Buffer];
}
