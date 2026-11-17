import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'An unexpected server error occurred';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as any;
      if (resp.error && typeof resp.error === 'object') {
        errorCode = resp.error.code || errorCode;
        errorMessage = resp.error.message || errorMessage;
      } else if (resp.message) {
        errorMessage = Array.isArray(resp.message)
          ? resp.message.join(', ')
          : resp.message;
        errorCode = resp.error || `HTTP_${status}`;
      }
    } else if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
      errorCode = `HTTP_${status}`;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Status ${status} - Error: ${errorMessage}`,
    );

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
