import { Link2, Loader2, Plus, Send, X } from 'lucide-react';
import React, { use, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MessageSection from './MessageSection';
import axios from 'axios';
import { toast } from 'sonner';
import useGetMessages from '../hooks/useGetMessages';
// import useSocketListener from '@/hooks/useSocketListener';
import useGetGroupMessages from '@/hooks/useGetGroupMessages';
import { useNavigate } from 'react-router-dom';
import ProfileBox from './ProfileBox';
import { setSelectedprofile } from '@/redux/authSlice';
// import { preview } from 'vite';

const Chatbox = () => {

    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedUser, user, selectedprofile } = useSelector((state) => state.auth);
    const { messages } = useSelector((state) => state.message);
    const { selectedGroup, groupMessages } = useSelector((state) => state.group);

    const [loading, setloading] = useState(false);


    const [input, setinput] = useState({
        text: "",
        file: null,
        preview: ""
    })


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setinput({
                ...input,
                file,
                preview: URL.createObjectURL(file), // 👈 preview URL create
            });
        }
    };

    const removeFile = () => {
        setinput({ ...input, file: null, preview: "" });
    };

    const sendFileHandler = async () => {
        if (!input.text && !input.file) {
            toast.error("Please enter a message or select a file to send");
            return;
        }
        setloading(true);
        try {
            const formData = new FormData();
            if (input.text) formData.append("text", input.text);
            if (input.file) formData.append("file", input.file);

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages/${selectedUser ? `send/${selectedUser._id}` 
                                                  : `group/send/${selectedGroup._id}`}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("message sent successfully");
                console.log(res.data.message);
                setinput({ text: "", file: null, preview: "" });
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message || "Failed to send message");
        }finally{
            setloading(false);
        }
    }

    useGetMessages({ receiverId: selectedUser?._id });
    useGetGroupMessages({ groupId: selectedGroup?._id });


    if (!selectedUser && !selectedGroup) {
        return (
            <div className='w-[70%] h-[95%] my-4 ml-4 mr-10 bg-white rounded-lg flex items-center justify-center'>
                <h2 className='text-2xl text-center font-semibold text-gray-400'>Select a user or group to start chatting</h2>
            </div>
        )
    }

    const lastSeen = selectedUser?.lastSeen ? new Date(selectedUser.lastSeen).toLocaleString() : "Unknown";

    return (
        <>
        <div className={`w-[70%] min-h-[95%] my-4 ml-1 ${selectedprofile ? "mr-1" : "mr-10"} bg-white rounded-lg flex flex-col`}>
            {/* Header */}
            {selectedUser && (<div className="px-5 flex gap-2 items-center border-b-2 cursor-pointer" onClick={() => dispatch(setSelectedprofile(selectedUser))}>
                <img
                    src={selectedUser?.profilePic}
                    alt={selectedUser?.name}
                    className="h-12 w-12 rounded-md object-cover border cursor-pointer border-gray-200"
                />
                <div className='flex flex-col cursor-pointer p-2'>
                    <h2 className="text-2xl font-bold ">{selectedUser?.name}</h2>
                    {selectedUser?.isOnline ? (<h2 className='text-green-600 text-xs'>Online</h2>) : (<h2 className='text-gray-700 text-xs'>Last seen: {lastSeen}</h2>)}
                </div>
            </div>)}

            {
                selectedGroup && (
                    <div className="flex items-center gap-2 p-2 border-b-2" onClick={() => dispatch(setSelectedprofile(selectedGroup))}>
                        <img
                            src={selectedGroup?.groupPic}
                            alt={selectedGroup?.name}
                            className="h-12 w-12 rounded-md object-cover border cursor-pointer border-gray-200"
                        />
                        <div className='flex flex-col cursor-pointer p-2'>
                            <h2 className="text-2xl font-bold ">{selectedGroup?.name}</h2>
                            <h2 className='text-gray-700 text-xs'>{selectedGroup?.description}</h2>
                        </div>
                    </div>
                )
            }

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 border-b-2">

                {selectedUser && <MessageSection messages={messages} currentUserId={user?.id}  />}
                {selectedGroup && <MessageSection messages={groupMessages} currentUserId={user?.id}  />}
            </div>


            {/* Input Section (Bottom) */}
            <div className="m-2 p-2 bg-slate-200 rounded-md flex flex-col gap-2 relative">

                {/* Show image preview ABOVE input */}
                {input.preview && (
                    <div className="absolute -top-28 left-0 w-full bg-gray-200 p-2 pb-3 rounded-lg  flex items-center justify-center">
                        <div className="relative">
                            <img
                                src={input.preview}
                                alt="preview"
                                className="h-24 w-24 object-cover rounded-lg border"
                            />
                            <button
                                onClick={removeFile}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Row */}
                <div className="w-full flex items-center gap-3">
                    {/* Input Box */}
                    <input
                        type="text"
                        name="text"
                        className="flex-1 rounded-xl px-4 py-2 bg-gray-100 focus:bg-white 
                       border border-transparent focus:border-slate-400 
                       focus:ring-2 focus:ring-slate-300 outline-none transition-all"
                        placeholder="Type your message..."
                        value={input.text}
                        onChange={(e) => setinput({ ...input, text: e.target.value })}
                    />

                    {/* File Upload */}
                    <label className="relative cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition">
                        <Plus className="text-slate-800 w-6 h-6" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>

                    {/* Send Button */}
                    <button
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                        onClick={sendFileHandler}
                    >
                       {
                        loading ? (
                            <Loader2 className="animate-spin text-white w-5 h-5" />
                        ) : (
                            <Send className="text-white w-5 h-5" />
                        )
                       } 
                    </button>
                </div>
            </div>

        </div>
        </>

    )
}

export default Chatbox