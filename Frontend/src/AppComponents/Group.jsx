import { setSelectedUser } from '@/redux/authSlice';
import { setSelectedGroup } from '@/redux/groupSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Group = ({ group }) => {
    const dispatch = useDispatch();
    const selectedGroup = useSelector((state) => state.group.selectedGroup);

    return (
        <div
            key={group._id}
            className={`${selectedGroup?._id === group._id ? "bg-cyan-100 dark:bg-cyan-800" : "bg-white"} flex items-center gap-4 p-3 dark:bg-slate-800 rounded-md shadow-sm hover:shadow-md hover:bg-cyan-200 transition cursor-pointer`}
            onClick={() =>{
                dispatch(setSelectedUser(null)),
                dispatch(setSelectedGroup(group))
            }}
        >
            {/* Group Pic */}
            <img
                src={group?.groupPic}
                alt={group?.name}
                className="h-12 w-12 rounded-md object-cover border border-gray-200"
            />

            {/* group Info */}
            <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {group?.name}
                </p>
                <p
                    className={"text-xs text-slate-700"}
                >
                    {group?.description}
                </p>
            </div>
        </div>
    )
}

export default Group