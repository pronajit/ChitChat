import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { setMyGroups } from "@/redux/groupSlice";

const useGetMyGroups = () =>{
    const dispatch = useDispatch();
    const fetchMyGroups = async()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/groups/my-groups`, {
                withCredentials: true
            });

            if(res.data.success){
                // console.log("My Groups:", res.data.groups);
                dispatch(setMyGroups(res.data.groups));
            }
        } catch (error) {
            console.error("Error fetching my groups:", error);
        }
    }
    useEffect(()=>{
        fetchMyGroups();
    }, [])
}

export default useGetMyGroups;


