import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(200, "Server is running fine"));
  } catch (error) {}
});

export { healthCheck };
