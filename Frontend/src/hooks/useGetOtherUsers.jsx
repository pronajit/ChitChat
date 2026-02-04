import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/authSlice';
import {toast} from 'sonner';

const useGetOtherUsers = ()=>{
    const dispatch = useDispatch();

    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`,{
                    withCredentials: true
                });

                if(res.data.success){
                    // toast.success(res.data.message);
                    // console.log("other users fetched" ,res.data.users);
                    dispatch(setOtherUsers(res.data.users));
                }

            } catch (error) {
                // toast.error("Error fetching other users", error.message);
                console.error("Error fetching other users:", error);
            }
        }
        getUser();
    },[])
}

export default useGetOtherUsers;