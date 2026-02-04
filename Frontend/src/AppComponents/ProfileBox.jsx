import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react' // ✅ Cross icon
import { setSelectedprofile } from '@/redux/authSlice';

const ProfileBox = () => {

    const dispatch = useDispatch();

    const { selectedUser } = useSelector((state) => state.auth)
    const { selectedGroup, groupMessages } = useSelector((state) => state.group)
    const { messages } = useSelector((state) => state.message)
    const { myGroups } = useSelector((state) => state.group)

    // Find common groups
    const commonGroups = myGroups?.filter(group =>
        group.members.some(member => member._id === selectedUser?._id)
    )

    // Media files
    const mediaFiles = messages?.filter(msg => msg.messageType === 'image' || msg.messageType === 'video');
    const groupMediaFiles = groupMessages?.filter(msg => msg.messageType === 'image' || msg.messageType === 'video');

    return (
        <div className="w-[60%] h-[95%] my-4 ml-1 mr-10 bg-white rounded-lg flex flex-col">
            {/* Header */}
            <div className="bg-slate-400 rounded-t-md flex items-center justify-between px-4 py-3 border-b">
                <h1 className="text-lg font-semibold text-slate-800">Profile Info</h1>
                <X
                    onClick={() => { dispatch(setSelectedprofile(null)) }}
                    className="w-6 h-6 text-white hover:text-black cursor-pointer transition-colors"
                />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">

                {/* Profile Section */}
                {selectedUser && (
                    <div className="flex flex-col overflow-y-auto no-scrollbar items-center gap-3 bg-sky-100 rounded-lg p-4 shadow-sm">
                        <img
                            src={selectedUser.profilePic}
                            alt={selectedUser.name}
                            className="h-[120px] w-[120px] rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
                            <p className="text-gray-600 text-sm">+91 {selectedUser.phoneNumber}</p>
                            {/* <p className="text-xs text-gray-500">
                {selectedUser.isOnline ? 'Online' : `Last seen: ${new Date(selectedUser.lastSeen).toLocaleString()}`}
              </p> */}
                        </div>
                    </div>
                )}

                {selectedGroup && (
                    <div className="flex flex-col overflow-y-auto no-scrollbar items-center gap-3 bg-sky-100 rounded-lg p-4 shadow-sm">
                        <img
                            src={selectedGroup?.groupPic}
                            alt={selectedGroup?.name}
                            className="h-[120px] w-[120px] rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-semibold">{selectedGroup?.name}</h2>
                            <p className="text-gray-600 text-sm">{selectedGroup?.description}</p>
                        </div>
                    </div>
                )}

                {/* Common Groups */}
                {selectedUser && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold border-b pb-1">Common Groups</h2>
                        {commonGroups?.length === 0 && (
                            <p className="text-gray-400 text-center">No common groups</p>
                        )}
                        {commonGroups?.map(group => (
                            <div key={group._id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition">
                                <img
                                    src={group.groupPic}
                                    alt={group.name}
                                    className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                />
                                <div>
                                    <h3 className="text-md font-medium">{group.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{group.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedGroup && (
                    <div>
                        <h1>Group Members</h1>
                        <h1 className='text-xs text-gray-600'>{selectedGroup?.members.length} Members</h1>
                        <div className="max-h-48 overflow-y-auto no-scrollbar mt-2 flex flex-col gap-2 border-2 rounded-md">
                            {selectedGroup?.members.map(member => (
                                <div key={member._id} className="flex justify-between items-center gap-2 p-2 hover:bg-gray-100 rounded-md border-b-2 transition">
                                    <img
                                        src={member.profilePic}
                                        alt={member.name}
                                        className="ml-5 h-12 w-12 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className='min-w-[76%] flex items-center justify-between gap-2'>
                                        <div>
                                        <h1 className="text-sm ">{member.name}</h1>
                                        <h1 className="text-xs text-sky-500">{member.email}</h1>
                                        </div>
                                        <h1 className="text-xs  text-slate-800">+91 {member.phoneNumber}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Shared Media */}
                {
                    selectedUser && (
                        <div>
                            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Shared Media</h2>
                            {mediaFiles?.length === 0 ? (
                                <p className="text-gray-400 text-center">No media files shared yet</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {mediaFiles.map(msg => (
                                        <div
                                            key={msg._id}
                                            className="rounded-md overflow-hidden border hover:shadow-md transition"
                                        >
                                            {msg.mediaUrl.endsWith('.mp4') || msg.mediaUrl.endsWith('.mov') ? (
                                                <video
                                                    controls
                                                    className="w-full h-[120px] object-cover"
                                                >
                                                    <source src={msg.mediaUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={msg.mediaUrl}
                                                    alt="shared media"
                                                    className="w-full h-[120px] object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    selectedGroup && (
                        <div>
                            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Group Media</h2>
                            {groupMediaFiles?.length === 0 ? (
                                <p className="text-gray-400 text-center">No media files shared yet</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {groupMediaFiles.map(msg => (
                                        <div
                                            key={msg._id}
                                            className="rounded-md overflow-hidden border hover:shadow-md transition"
                                        >
                                            {msg.mediaUrl.endsWith('.mp4') || msg.mediaUrl.endsWith('.mov') ? (
                                                <video
                                                    controls
                                                    className="w-full h-[120px] object-cover"
                                                >
                                                    <source src={msg.mediaUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={msg.mediaUrl}
                                                    alt="shared media"
                                                    className="w-full h-[120px] object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default ProfileBox
