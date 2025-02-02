import noPhoto from '../assets/images/no-photo.png'

export const setPhoto = (url) => {
  if (url) {
    return `${process.env.REACT_APP_SERVER_URL}/${url}`;
  } else {
    return noPhoto;
  }
};
