import { StatusCodes,getReasonPhrase } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
      this.statusMessage = getReasonPhrase(StatusCodes.UNAUTHORIZED);
  }
}

export default NotFoundError;
