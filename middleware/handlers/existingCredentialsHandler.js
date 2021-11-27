exports.existingCredentialsHandler = async (res, credential) => {
  return await res.status(401).json({
    code: 401,
    status: false,
    response: `New ${credential} must be different from previous ${credential}`,
  });
};
