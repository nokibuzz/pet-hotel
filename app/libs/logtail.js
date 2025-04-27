import { Logtail } from "@logtail/node"; 

const logger = new Logtail(process.env.LOGTAIL_TOKEN, { endpoint: process.env.LOGTAIL_HOST });

export async function logError(request, currentUserId, error) {
  try {
    const errorMessage = error?.message || 'Unknown error';
    const errorStack = error?.stack || 'No stack trace';
    const errorName = error?.name || 'UnknownError';

    const apiRoute = request?.url || '';
    const apiMethod = request?.method || '';

    await logger.error(errorMessage, {
      message: errorMessage,
      stack: errorStack,
      level: 'error',
      context: {
        apiRoute: apiRoute,
        method: apiMethod,
        userId: currentUserId,
        timestamp: new Date().toISOString(),
      },
      error: {
        name: errorName,
        message: errorMessage,
        stack: errorStack,
      },
    });
  } catch (error) {
    console.error('Fatal error for log error:', error);
  }
}

export async function logInfo(request, currentUserId, message, addionalData = {}) {
  try {
    const apiRoute = request?.url || '';
    const apiMethod = request?.method || '';

    await logger.info(message, {
      message: message,
      level: 'info',
      context: {
        addionalData: addionalData,
        apiRoute: apiRoute,
        method: apiMethod,
        userId: currentUserId,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Fatal error for log info:', error);
  }
}
