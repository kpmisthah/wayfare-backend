import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export class Logging {
  dailyRotateFileTransport: DailyRotateFile;
  createLoggerConfig: winston.LoggerOptions;

  constructor() {
    const DailyRotateFileConstructor = DailyRotateFile as unknown as new (
      options: Record<string, unknown>,
    ) => DailyRotateFile;

    this.dailyRotateFileTransport = new DailyRotateFileConstructor({
      filename: `logs/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', 
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    const errorFileTransport = new DailyRotateFileConstructor({
      filename: `logs/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
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
      winston.format.printf(
        ({ timestamp, level, message, context, ...meta }) => {
          const contextStr = context ? `[${String(context)}]` : '';
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${String(timestamp)} ${level} ${contextStr} ${String(message)}${metaStr}`;
        },
      ),
    );

    this.createLoggerConfig = {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [

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
