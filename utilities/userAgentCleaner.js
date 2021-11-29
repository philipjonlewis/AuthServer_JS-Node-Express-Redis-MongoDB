exports.userAgentCleaner = (x) => {
  for (y in x) {
    if (x.hasOwnProperty(y) && x[y] === false) {
      delete x[y];
    }
  }
  return x;
};
