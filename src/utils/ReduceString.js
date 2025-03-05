export const ReduceString = (str, limit) => {
  if (str) {
    return str.length > limit ? `${str.substring(0, limit)}...` : str;
  }
};
