import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';

const MessageSection = ({ messages, currentUserId }) => {
    const { selectedprofile } = useSelector((state) => state.auth);

    const bottomRef = useRef(null);

    useEffect(() => {
        if (messages && messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col gap-3 p-4 overflow-y-auto no-scrollbar max-h-[60vh]">
            {messages && messages.length > 0 ? (
                [...messages].reverse().map((msg, index) => {
                    const isSender = msg?.sender?._id === currentUserId;

                    return (
                        <div
                            key={index}
                            className={`flex  gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Agar receiver ka message hai toh LEFT side pe profile */}
                            {!isSender && (
                                <img
                                    src={msg?.sender?.profilePic}
                                    alt={msg?.sender?.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`relative p-3 rounded-2xl shadow-md min-w-[12%] max-w-[70%] flex flex-col
                                       ${!isSender
                                        ? 'bg-cyan-200 text-black rounded-br-none'
                                        : 'bg-purple-100 text-black rounded-bl-none'}`}
                            >
                                {/* Image */}
                                {msg?.mediaUrl && (
                                    <img
                                        src={msg.mediaUrl}
                                        alt="message media"
                                        className="rounded-lg mb-2 max-h-60 w-auto max-w-xs sm:max-w-sm md:max-w-md object-cover"
                                    />
                                )}

                                {/* Text */}
                                {msg?.text && (
                                    <p className={`${selectedprofile ? 'text-sm' : 'text-md'} mb-5`}>
                                        {msg.text}
                                    </p>
                                )}

                                {/* Time */}
                                <span className={`${selectedprofile ? 'text-[10px]' : 'text-sm'} opacity-70 absolute bottom-2 ${!isSender ? 'right-3' : 'left-3'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Agar sender ka message hai toh RIGHT side pe profile */}
                            {isSender && (
                                <img
                                    src={msg?.sender?.profilePic}
                                    alt={msg?.sender?.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400 text-xl text-center">No messages yet!</p>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessageSection
