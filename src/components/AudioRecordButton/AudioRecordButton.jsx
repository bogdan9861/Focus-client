import React, { useEffect, useRef, useState } from "react";
import { useSendVoiceMutation } from "../../app/service/chat";
import { useDispatch, useSelector } from "react-redux";

import {
  setLocked,
  setStarted,
  setPassedDistance,
} from "../../features/audioLock";
import { setStatus } from "../../features/chat";

import "./AudioRecordButton.scss";

const AudioRecordButton = ({ sendMessage, chatId, changeStatus }) => {
  const [doSendVoice] = useSendVoiceMutation();

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);

  const started = useSelector((state) => state.audioLock.started);
  const locked = useSelector((state) => state.audioLock.locked);
  const gapToLock = useSelector((state) => state.audioLock.gapToLock);

  const audioBtn = useRef(null);
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

  const handleMouseDown = (e, touch) => {
    if ((e.button !== 0 || locked) && !touch) return;

    e.target.classList.add("audioBtn--active");

    const start = touch ? e.touches[0].pageY : e.clientY;

    dispatch(setStarted(true));
    changeStatus("Записывает аудио");

    const handleMouseMove = (e) => {
      let Y = touch ? e.touches[0].pageY : e.clientY;
      dispatch(setPassedDistance(start - Y));
      if (Y < start - gapToLock) {
        dispatch(setLocked(true));

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleMouseMove);
      }
    };
    window.addEventListener(touch ? "touchmove" : "mousemove", handleMouseMove);

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

  const stopRecording = (e, touch) => {
    if (e.button !== 0) return;

    dispatch(setStarted(false));
    dispatch(setStatus(""));
    dispatch(setLocked(false));

    audioBtn.current.classList.remove("audioBtn--active");

    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    const handleMouseUp = (e) => {
      if (locked) return;

      stopRecording(e);
    };
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [locked]);

  return (
    <button
      ref={audioBtn}
      className={`audioBtn ${
        locked ? "audioBtn--locked audioBtn--active" : ""
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => handleMouseDown(e, true)}
      onTouchEnd={(e) => stopRecording(e, true)}
      onClick={stopRecording}
    >
      {!started ? (
        <img
          src="https://img.icons8.com/?size=100&id=85836&format=png&color=aaaaaa"
          alt="microphone"
        />
      ) : locked ? (
        <img
          style={{
            width: 25,
            height: 25,
            objectFit: "contain",
            transform: "translate(3px, -1px)",
          }}
          src="https://img.icons8.com/?size=100&id=IISmtYu065Oa&format=png&color=ffffff"
          alt="send"
        />
      ) : (
        <img
          src="https://img.icons8.com/?size=100&id=85836&format=png&color=ffffff"
          alt="microphone"
        />
      )}
    </button>
  );
};

export default AudioRecordButton;
