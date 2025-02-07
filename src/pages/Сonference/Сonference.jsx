import React from "react";
import { useParams } from "react-router";

import { Modal } from "antd";
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";

import leave from "../../assets/icons/leave.svg";
import mute from "../../assets/icons/mute.svg";
import microphone from "../../assets/icons/microphone.svg";
import cameraRotate from "../../assets/icons/CameraRotate.svg";

import "./Сonference.scss";

function layout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber }).reduce(
    (acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    },
    []
  );

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs
    .map((row, index, arr) => {
      if (index === arr.length - 1 && row.length === 1) {
        return [
          {
            width: "100%",
            height,
          },
        ];
      }

      return row.map(() => ({
        width: "50%",
        height,
      }));
    })
    .flat();
}

const Сonference = () => {
  const { id: roomID } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomID);
  const videoLayout = layout(clients.length);

  return (
    <div className="conference">
      <div className="conference__inner">
        {clients.map((clientID, index) => {
          return (
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              <video
                width="100%"
                height="100%"
                ref={(instance) => {
                  provideMediaRef(clientID, instance);
                }}
                autoPlay
                playsInline
                muted={clientID === LOCAL_VIDEO}
              />
            </div>
          );
        })}
      </div>
      <div className="conference__controls">
        <div className="conference__controls-inner">
          <button className="conference__controls-btn">
            <img src={cameraRotate} alt="" />
          </button>
          <button className="conference__controls-btn">
            <img src={mute} alt="" />
            {/* <img src={microphone} alt="" /> */}
          </button>
          <button className="conference__controls-btn red">
            <img src={leave} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Сonference;
