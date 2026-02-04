import { setMessages } from "@/redux/messageSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetMessages = ({receiverId}) =>{

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/get/${receiverId}`,{
                    withCredentials: true
                });
                
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (receiverId) {
            fetchMessages();
        }
    }, [receiverId, dispatch]);
};


export default useGetMessages;