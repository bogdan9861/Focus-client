import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/index";

import { useCurrentUserQuery } from "../../app/service/user";

import "./CallOfferModal.scss";

const CallOfferModal = () => {
  const user = useCurrentUserQuery();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [conferenceId, setConferenceId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    socket.on(
      "get-call-offer",
      ({ photo, name, conferenceId, recipientId }) => {
        if (!user.isLoading && recipientId === user.data.id) {
          setOpen(true);
          setName(name);
          setPhoto(photo);
          setConferenceId(conferenceId);
        }
      }
    );
  }, [user.isLoading]);

  const onAccept = () => {
    navigate(`/conference/${conferenceId}`);
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <div className="conferenceModal">
      <Modal open={open} onCancel={() => setOpen(false)}>
        <div className="conferenceModal__inner">
          <img className="conferenceModal__img" src={photo} alt="" />
          <div className="conferenceModal__info">
            <span className="conferenceModal__info-name">{name}</span>
            <span className="conferenceModal__info-text">Звонок</span>
          </div>
          <div className="conferenceModal__controls">
            <button
              className="conferenceModal__controls-accept conferenceModal__controls-btn"
              onClick={onAccept}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
                    fill="#ffffff"
                  ></path>
                </g>
              </svg>
            </button>
            <button
              className="conferenceModal__controls-reject conferenceModal__controls-btn"
              onClick={onCancel}
            >
              <svg
                fill="#ffffff"
                viewBox="0 0 56 56"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M 28.0235 17.6055 C 17.8751 17.6055 8.3361 19.7383 3.5783 24.4961 C 1.4454 26.6524 .3439 29.2539 .4845 32.3945 C .5782 34.2929 1.1642 35.9805 2.2657 37.0820 C 3.1095 37.9258 4.2345 38.3945 5.5704 38.1836 L 14.2657 36.7070 C 15.5783 36.4961 16.4923 36.0976 17.0783 35.4883 C 17.8517 34.7383 18.0861 33.6133 18.0861 32.1367 L 18.1095 29.7695 C 18.1095 29.3945 18.2735 29.1133 18.4845 28.8789 C 18.7188 28.5976 19.0704 28.4805 19.3283 28.4102 C 20.9220 28.0351 24.1798 27.6836 28.0235 27.6836 C 31.8908 27.6836 35.1251 27.9648 36.7188 28.4336 C 36.9532 28.5039 37.2814 28.6445 37.5392 28.8789 C 37.7735 29.1133 37.9142 29.3711 37.9142 29.7461 L 37.9376 32.1367 C 37.9610 33.6133 38.1954 34.7383 38.9454 35.4883 C 39.5548 36.0976 40.4688 36.4961 41.7814 36.7070 L 50.3593 38.1602 C 51.7422 38.3945 52.9144 37.9024 53.8283 37.0117 C 54.9299 35.9336 55.5390 34.2695 55.5861 32.3711 C 55.6561 29.2070 54.4609 26.6055 52.3518 24.4961 C 47.5705 19.7383 38.1720 17.6055 28.0235 17.6055 Z"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CallOfferModal;
