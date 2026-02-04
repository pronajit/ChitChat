import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/redux/authSlice';
import { setSelectedGroup } from '@/redux/groupSlice';

const User = ({ user }) => {
    const dispatch = useDispatch();

    const selectedUser = useSelector((state) => state.auth.selectedUser);
    

    return (
        <div
            key={user._id}
            className={`${selectedUser?._id === user._id ? "bg-cyan-100 dark:bg-cyan-800" : "bg-white"} flex items-center gap-4 p-3 dark:bg-slate-800 rounded-md shadow-sm hover:shadow-md hover:bg-cyan-200 transition cursor-pointer`}
            onClick={() => {
                dispatch(setSelectedGroup(null)),
                dispatch(setSelectedUser(user))
            }}
        >
            {/* Profile Pic */}
            <img
                src={user?.profilePic}
                alt={user?.name}
                className="h-12 w-12 rounded-md object-cover border border-gray-200"
            />

            {/* User Info */}
            <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {user.name}
                </p>
                <p
                    className={`text-xs ${user?.isOnline
                        ? "text-green-500"
                        : "text-gray-400 dark:text-gray-500"
                        }`}
                >
                    {user?.isOnline ? "Online" : "Offline"}
                </p>
            </div>
        </div>
    )
}

export default User