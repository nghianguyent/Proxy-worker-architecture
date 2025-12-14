export interface DriverError extends Error {
  cause?: string;
  length: number;
  name: string;
  severity: string;
  code: string;
  detail?: string;
  schema?: string;
  table?: string;
  constraint?: string;
}
