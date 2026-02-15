/* eslint-disable prettier/prettier */
export enum BusinessErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class BusinessError extends Error {
  constructor(
    public readonly code: BusinessErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'BusinessError';
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
