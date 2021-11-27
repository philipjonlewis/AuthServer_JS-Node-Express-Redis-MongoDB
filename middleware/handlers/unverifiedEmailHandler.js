exports.unverifiedEmailHandler = async (res) => {
  return await res.status(401).json({
    code: 401,
    status: false,
    response: "Unable to process request until email is verified",
  });
};
