export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: unknown;
  timestamp: string;
  detail?: unknown;
  path?: unknown;
}
