import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Custom Winston Logger Configuration
 * - Logs to console (colorized for development)
 * - Logs to daily rotating files (JSON for production analysis)
 */
export class Logging {
  dailyRotateFileTransport: DailyRotateFile;
  createLoggerConfig: winston.LoggerOptions;

  constructor() {
    const DailyRotateFileConstructor = DailyRotateFile as unknown as new (
      options: Record<string, unknown>,
    ) => DailyRotateFile;

    // File transport - JSON logs for production analysis
    this.dailyRotateFileTransport = new DailyRotateFileConstructor({
      filename: `logs/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    // Error file transport - separate file for errors only
    const errorFileTransport = new DailyRotateFileConstructor({
      filename: `logs/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep error logs for 30 days
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    // Console format for development
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? `[${String(context)}]` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${String(timestamp)} ${level} ${contextStr} ${String(message)}${metaStr}`;
      }),
    );

    this.createLoggerConfig = {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        // Console transport - always show logs in terminal
        new winston.transports.Console({
          format: consoleFormat,
        }),
        // File transports
        this.dailyRotateFileTransport,
        errorFileTransport,
      ],
    };
  }
}

