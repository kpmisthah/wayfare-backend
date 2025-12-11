/**
 * HTTP Status Codes Enum
 * Standard HTTP response status codes for API responses
 */
export enum StatusCode {
  // Success codes
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // Client error codes
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // Server error codes
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}
