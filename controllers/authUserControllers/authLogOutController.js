const { asyncHandler } = require("../../middleware/handlers/asyncHandler");
exports.logOutController = asyncHandler(async (req, res) => {
  return await res
    .status(200)
    .clearCookie("__Secure-datetask-refresh", { path: "/" })
    .clearCookie("__Secure-datetask-access", { path: "/" })
    .clearCookie("__Secure-datetask-reset", { path: "/" })
    .header("Authorization", `Bearer `)
    .json({
      code: 200,
      status: true,
      response: "Successfully logged out",
    });
});
