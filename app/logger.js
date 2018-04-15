import winston from 'winston';

global.logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, timestamp, message }) => `${level}: [${timestamp}] ${message}`),
  ),
  transports: [new winston.transports.Console()],
});
winston.addColors({
  info: 'cyan',
  warn: 'yellow',
});
