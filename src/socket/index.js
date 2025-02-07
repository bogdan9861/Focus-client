import io from "socket.io-client";

export const socket = io.connect("https://focus-socket.onrender.com");
