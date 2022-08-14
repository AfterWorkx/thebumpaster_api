import {createLogger, format, transports} from "winston";

const consoleFormat = format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const Logger = (label = "service") => {
    return createLogger({
        level: 'debug',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.label({label: label}),
            format.errors({stack: true}),
            format.splat(),
            format.json()
        ),
        defaultMeta: {service: 'sero-somak-api-server'},
        transports: [
            // - Write all logs error (and below) to `quick-start-error.log`.
            new transports.File({filename: 'error.log', level: 'error'}),
            new transports.Console({
                level: process.env.DEBUG === "true" ? "debug" : "info",
                format: format.combine(
                    format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }),
                    format.label({label: label}),
                    consoleFormat,
                )
            })
        ]
    });
}

export default Logger