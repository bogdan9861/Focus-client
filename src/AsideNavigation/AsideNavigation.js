import home from ".././assets/icons/home.svg";
import add from ".././assets/icons/add.svg";
import profile from ".././assets/icons/profile.svg";
import friends from ".././assets/icons/friends.svg";

export const AsideNavigation = [
  {
    label: "главная",
    image: home,
    link: "/",
  },
  {
    label: "cоздать",
    image: add,
    link: "/",
  },
  {
    label: "друзья",
    image: friends,
    link: "/",
  },
  {
    label: "профиль",
    image: profile,
    link: `/profile/`,
  },
];
