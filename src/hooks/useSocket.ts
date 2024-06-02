import { useContext } from "react";
import { SocketContext } from "../context/socket/SocketProvider";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined)
    throw new Error("context was used outline a Socket Context");
  return context;
};
