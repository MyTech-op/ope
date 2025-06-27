import { StatusCodes ,getReasonPhrase } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  // let customError = {
  //   statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  //   msg: err.message || "Something went wrong, try again later",
  // };

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let statusMessage = err.statusMessage || getReasonPhrase(statusCode);
  let message = err.message || "Something went wrong, try again later";

  if (err.name === "ValidationError") {
       message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    statusCode = StatusCodes.BAD_REQUEST;
    statusMessage = getReasonPhrase(statusCode);
  }
  if (err.code && err.code === 11000) {
    message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
     statusCode = 400;
    statusMessage = getReasonPhrase(statusCode);
  }
  if (err.name === "CastError") {
    message = `No item found with id: ${err.value}`;
    statusCode = StatusCodes.NOT_FOUND;
    statusMessage = getReasonPhrase(statusCode);
  }
  return res.status(statusCode).json({
    statusCode,
    statusMessage,
    message,
    data: null,
  });
};


export default errorHandlerMiddleware;
