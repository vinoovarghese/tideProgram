
const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [

    new transports.Console({
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),

    new transports.Console({
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    
  ],
});



/*const logger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});*/

 module.exports = logger;
