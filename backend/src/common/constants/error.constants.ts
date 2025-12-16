import { HttpStatus } from '@nestjs/common';

export const PostgresErrorMap: Record<string, number> = {
  // Client Errors (4xx)
  '23505': HttpStatus.CONFLICT, // Unique violation (e.g. duplicate email)
  '23503': HttpStatus.BAD_REQUEST, // FK violation (e.g. invalid user_id)
  '23502': HttpStatus.BAD_REQUEST, // Not null violation (missing field)
  '23514': HttpStatus.BAD_REQUEST, // Check violation (e.g. age < 0)
  '22P02': HttpStatus.BAD_REQUEST, // Invalid syntax (e.g. UUID format wrong)
  '22001': HttpStatus.BAD_REQUEST, // Value too long for column

  // Server Errors (5xx)
  '40P01': HttpStatus.SERVICE_UNAVAILABLE, // Deadlock
  '08000': HttpStatus.SERVICE_UNAVAILABLE, // Connection error
  '08003': HttpStatus.SERVICE_UNAVAILABLE, // Connection does not exist
  '08006': HttpStatus.SERVICE_UNAVAILABLE, // Connection failure
};

export const PostgresErrorMessages: Record<string, string> = {
  '23505': 'Unique violation {table}',
  '23503': 'FK violation (e.g. invalid user_id)',
  '23502': 'Not null violation {table}',
  '23514': 'Check violation (e.g. age < 0)',
  '22P02': 'Invalid syntax (e.g. UUID format wrong)',
  '22001': 'Value too long for column',
  '40P01': 'Deadlock',
  '08000': 'Connection error',
  '08003': 'Connection does not exist',
  '08006': 'Connection failure',
};
