import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export class Logger {
    private static instance: winston.Logger;

    static getInstance(name: string): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                level: process.env.LOG_LEVEL || 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple()
                        )
                    }),
                    new DailyRotateFile({
                        filename: 'logs/instagram-ai-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        maxSize: '20m',
                        maxFiles: '14d'
                    })
                ]
            });
        }
        return Logger.instance.child({ service: name });
    }

    constructor(private name: string) {}

    info(message: string, meta?: any) {
        Logger.getInstance(this.name).info(message, meta);
    }

    warn(message: string, meta?: any) {
        Logger.getInstance(this.name).warn(message, meta);
    }

    error(message: string, meta?: any) {
        Logger.getInstance(this.name).error(message, meta);
    }
} 