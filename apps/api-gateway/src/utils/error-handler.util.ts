import {
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorObject {
  message?: string;
  status?: number;
  statusCode?: number;
}

export function handleRpcError(
  error: unknown,
  logger: Logger,
  operation: string,
): never {
  logger.error(`API Gateway: Failed to ${operation}`, error);

  let rpcError: RpcErrorObject | string | undefined;
  let message = `An unexpected error occurred while ${operation}`;
  let status: number | undefined;

  if (error instanceof RpcException) {
    const err = error.getError();
    if (typeof err === 'string') {
      message = err;
    } else if (typeof err === 'object' && err !== null) {
      rpcError = err as RpcErrorObject;
      message = rpcError.message || 'Unknown RpcException error';
      status = rpcError.status || rpcError.statusCode;
    } else {
      message = 'Unknown RpcException format';
    }
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  ) {
    rpcError = error as RpcErrorObject;
    message = rpcError.message || 'Unknown microservice error';
    status = rpcError.status || rpcError.statusCode;
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (status === 404 || message.toLowerCase().includes('not found')) {
    throw new NotFoundException(message);
  } else if (
    status === 400 ||
    message.toLowerCase().includes('validation') ||
    message.toLowerCase().includes('constraint')
  ) {
    throw new BadRequestException(message);
  }

  // Default to InternalServerErrorException
  throw new InternalServerErrorException(message);
}
