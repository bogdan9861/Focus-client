export const splitMessage = (str, limit) => {
  let gap = 0;
  let arr = [];

  for (let i = 0; i < str.length / limit; i++) {
    arr.push(str.slice(gap, limit + gap));
    gap += limit;
  }

  return arr
};
