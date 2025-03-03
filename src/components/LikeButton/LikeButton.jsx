import React from "react";

const LikeButton = ({ onLike, isLikedLocal }) => {
  return (
    <button className="feed__post-statistic-btn" onClick={() => onLike()}>
      <svg
        width="auto"
        height="auto"
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <desc>Created with Pixso.</desc>
        <defs>
          <clipPath id="clip2_86">
            <rect
              id="heart"
              width="27.000000"
              height="27.000000"
              fill="white"
              fillOpacity="0"
            />
          </clipPath>
        </defs>
        <g clipPath="url(#clip2_86)">
          <path
            id="path"
            d="M22.64 5.98C23.63 6.97 24.13 8.26 24.13 9.56C24.13 10.86 23.63 12.15 22.64 13.14L13.5 22.29L4.35 13.14C3.36 12.15 2.86 10.86 2.86 9.56C2.86 8.26 3.36 6.97 4.35 5.98C5.33 4.99 6.63 4.49 7.93 4.49C9.22 4.49 10.52 4.99 11.51 5.98L12.7 7.17C13.14 7.61 13.85 7.61 14.29 7.17L15.49 5.97C16.47 4.99 17.77 4.49 19.06 4.49C20.36 4.49 21.66 4.99 22.64 5.98ZM24.24 4.39C22.81 2.96 20.93 2.24 19.06 2.24C17.2 2.24 15.32 2.96 13.89 4.38L13.5 4.78L13.1 4.39C11.67 2.96 9.8 2.24 7.93 2.24C6.06 2.24 4.18 2.96 2.75 4.39C1.33 5.81 0.61 7.69 0.61 9.56C0.61 11.43 1.33 13.3 2.75 14.73L12.7 24.67C13.14 25.11 13.85 25.11 14.29 24.67L24.24 14.73C25.66 13.3 26.38 11.43 26.38 9.56C26.38 7.69 25.67 5.82 24.24 4.39Z"
            fill={isLikedLocal ? "#e00" : "#000"}
            fillOpacity="1.000000"
            fillRule="nonzero"
          />
        </g>
      </svg>
    </button>
  );
};

export default LikeButton;
