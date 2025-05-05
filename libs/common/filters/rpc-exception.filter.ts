import {
    RpcExceptionFilter,
    Catch,
    ArgumentsHost
  } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
  
  @Catch(RpcException)
  export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
      const ctx = host.switchToRpc();
      const request = ctx.getContext().getRequest();
    
      const status =
        exception instanceof RpcException
          ? exception.getError()
          : 500;
  
      const message =
        exception instanceof RpcException
          ? exception.getError()
          : exception;
  
      return throwError(() => ({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: message,
      }));
    }
  }
  