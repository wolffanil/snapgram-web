import { useContext } from "react";
import { SocketContext } from "../context/socket/SocketProvider";

export const useSocket = () => useContext(SocketContext);
