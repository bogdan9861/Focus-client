import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { socket } from "../../../socket/index";

import { useCurrentUserQuery } from "../../../app/service/user";

import DotsAnimation from "../../../components/DotsAnimation/DotsAnimation";
import call from "../../../assets/icons/call.svg";

import { setConferenceId } from "../../../features/conference";

import "../Chat.scss";

const HeadInfo = ({
  photo,
  name,
  status,
  chat,
  link,
  func,
  membersCount,
  id,
}) => {
  const navigate = useNavigate();
  const [conferenceId, setConferenceId] = useState();
  const user = useCurrentUserQuery();

  const dispatch = useDispatch();

  const handleClick = () => {
    if (link) {
      navigate(link);
    } else {
      func();
    }
  };

  useEffect(() => {
    setConferenceId(v4());
  }, []);

  const createConference = useCallback(() => {
    navigate(`/conference/${conferenceId}`);
    socket.emit("send-call-offer", photo, name, conferenceId, id);
  }, [conferenceId]);

  return (
    <div className="chat-body__head-info__wrapper">
      <div className="chat-body__head-info">
        <img className="chat-body__head-img viewer" src={photo} alt="" />
        <div className="chat-body__head-info__content" onClick={handleClick}>
          <h2 className="chat-body__head-name">{name}</h2>

          <span className="chat-body__head-status">
            {status !== "" ? <DotsAnimation /> : null}
            {chat
              ? status !== ""
                ? status
                : membersCount
                ? `${membersCount} участника`
                : "Был(а) недавно"
              : null}
          </span>
        </div>
      </div>
      <button className="chat-body__head-call" onClick={createConference}>
        <img src={call} alt="" />
      </button>
    </div>
  );
};

export default HeadInfo;
