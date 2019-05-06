export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVE_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}

// available env.
export const ENV: IOptions = {
  production: 'production',
  prod: 'production',
  dev: 'development',
  development: 'development',
  lab: 'lab',
  staging: 'staging',
  test: 'test',
};
