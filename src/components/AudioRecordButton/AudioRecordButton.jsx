import React, { useEffect, useRef, useState } from "react";
import { useSendVoiceMutation } from "../../app/service/chat";
import { useDispatch, useSelector } from "react-redux";

import {
  setLocked,
  setPostion,
  setStarted,
  setWayHeight,
} from "../../features/audioLock";
import { setStatus } from "../../features/chat";

import "./AudioRecordButton.scss";

const AudioRecordButton = ({ sendMessage, chatId, changeStatus }) => {
  const [doSendVoice] = useSendVoiceMutation();

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);

  const started = useSelector((state) => state.audioLock.started);
  const locked = useSelector((state) => state.audioLock.locked);

  const chunks = useRef([]);

  const dispatch = useDispatch();

  const sendAudio = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, ".mp3");
    formData.append("chatId", chatId);

    try {
      const messages = await doSendVoice(formData).unwrap();

      if (messages) {
        sendMessage(messages[messages.length - 1].audio);
      }
    } catch (error) {}
  };

  const handleMouseDown = async (e) => {
    if (e.button !== 0) return;

    e.target.classList.add("audioBtn--active");

    const start = e.clientY;
    const gapToLock = 100;

    dispatch(setStarted(true));
    dispatch(setWayHeight(gapToLock));
    changeStatus("Записывает аудио");

    const handleMouseMove = (e) => {
      if (e.clientY < start - gapToLock) {
        dispatch(setLocked(true));

        window.removeEventListener("mousemove", handleMouseMove);
      } else {
        dispatch(setPostion(e.clientY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);

        sendAudio(recordedBlob);

        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = (e) => {
    if (e.button !== 0) return;

    dispatch(setLocked(false));
    dispatch(setStarted(false));

    e.target.classList.remove("audioBtn--active");
    dispatch(setStatus(""));

    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    changeStatus("");

    setStarted(false);
  };

  return (
    <button
      className="audioBtn"
      onMouseDown={handleMouseDown}
      onMouseUp={stopRecording}
    >
      {!started ? (
        <img
          src="https://img.icons8.com/?size=100&id=85836&format=png&color=aaaaaa"
          alt=""
        />
      ) : locked ? (
        <img
          style={{
            width: 25,
            height: 25,
            objectFit: "contain",
            transform: "translate(3px, 2px)",
          }}
          src="https://img.icons8.com/?size=100&id=IISmtYu065Oa&format=png&color=ffffff"
          alt="send"
        />
      ) : (
        <img
          src="https://img.icons8.com/?size=100&id=85836&format=png&color=ffffff"
          alt=""
        />
      )}
    </button>
  );
};

export default AudioRecordButton;
