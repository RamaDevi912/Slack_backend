import winston from 'winston';
import path from 'path';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  // Console transport
  new winston.transports.Console(),
  // File transport for errors
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: path.join('logs', 'all.log'),
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
});

export default logger;

/**
 * HTTP request logger middleware
 */
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'http';

    logger.log(
      level,
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
};
