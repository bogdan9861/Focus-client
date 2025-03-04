import React from "react";

const LikeButton = ({ onLike, isLikedLocal }) => {
  return (
    <button
      className={`feed__post-statistic-btn ${
        isLikedLocal && "feed__post-statistic-btn--liked"
      }`}
      onClick={() => onLike()}
    >
      <svg
        version="1.1"
        id="heart-15"
        xmlns="http://www.w3.org/2000/svg"
        width="25px"
        height="25px"
        viewBox="0 0 15 15"
      >
        <path
          d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
	C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"
        ></path>
      </svg>
    </button>
  );
};

export default LikeButton;
