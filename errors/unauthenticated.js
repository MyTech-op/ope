import { StatusCodes,getReasonPhrase } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.statusMessage = getReasonPhrase(StatusCodes.UNAUTHORIZED);
  }
}

export default UnauthenticatedError;
