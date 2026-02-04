import { setGroupMessages } from "../redux/groupSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetGroupMessages = ({groupId})=>{
    const dispatch = useDispatch();

    const fetchGroupMessages = async()=>{
       try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/group/get/${groupId}`,{
            withCredentials: true
        });
        if(res.data.success){
            // console.log("Group messages fetched successfully", res.data.messages);
            dispatch(setGroupMessages(res.data.messages));
        }
       } catch (error) {
        console.log(error);
       }
    }

    useEffect(() => {
        if (groupId) {
            fetchGroupMessages();
        }
    }, [groupId]);
}

export default useGetGroupMessages;