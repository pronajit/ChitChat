import { useDispatch } from "react-redux";
import { getSocket } from "../utils/Socket";
import { useEffect } from "react";
import { addMessage } from "../redux/messageSlice";
import { toast } from "sonner";
import { addGroupMessage } from "../redux/groupSlice";

const useSocketListener = () => {
  console.log("useSocketListener triggered");  
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();

    console.log("useEffect triggered" , socket);

    socket?.on("new-message", (message) => {
      // console.log("Received new message:", message);
      dispatch(addMessage(message));
      toast.success("New message received");
      // console.log("Dispatched new message:", message);
    });

    socket?.on("new-groupMessage", (message) => {
      console.log("Received new group message:", message);
      dispatch(addGroupMessage(message));
      toast.success("New group message received");
    });

    return () => {
      socket?.off("new-message");
      socket?.off("new-groupMessage");
    };
  }, [dispatch]);
};

export default useSocketListener;
