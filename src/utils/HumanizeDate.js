export const HumanizeDate = (date) => {
  const mounths = {
    "01": "Января",
    "02": "Февраля",
    "03": "Марта",
    "04": "Апреля",
    "05": "Мая",
    "06": "Июня",
    "07": "Июля",
    "08": "Августа",
    "09": "Сентября",
    10: "Октября",
    11: "Ноября",
    12: "Декабря",
  };

  const rawDate = date.split("T").shift();

  const Y = rawDate.split("-")[0];
  const M = mounths[rawDate.split("-")[1]];
  const D = rawDate.split("-")[2];

  return `${D} ${M} ${Y}`;
};
