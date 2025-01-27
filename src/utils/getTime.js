export const getTime = () => {
  const date = new Date();

  const zero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return `${zero(date.getHours())}:${zero(date.getMinutes())}`;
};