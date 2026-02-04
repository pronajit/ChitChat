import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import CreateGroupDialog from './CreateGroupDialog';
import { useSelector } from 'react-redux';
import useGetMyGroups from '@/hooks/useGetMyGroups';
import Group from './Group';

const Groups = ({ activeTab }) => {
    
    const {searchValue} = useSelector((state) => state.auth);
    const myGroups = useSelector((state) => state.group.myGroups);

    const [filteredGroups, setFilteredGroups] = useState(myGroups);

    useGetMyGroups();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(!searchValue) {
            setFilteredGroups(myGroups);
        } else {
            setFilteredGroups(
                myGroups.filter(group => group.name.toLowerCase().includes(searchValue.toLowerCase()))
            );
        }
    }, [searchValue, myGroups]);

    return (
        <>
            <div className="mt-3 flex flex-col gap-1 overflow-y-auto w-full max-w-md">
                {activeTab === "Groups" && <button className="w-1/3 text-left text-sm font-semibold py-1 px-4 bg-slate-800 text-white rounded-lg"
                    onClick={() => setOpen(true)}>Create New</button>}

            </div>

            <div className="mt-2 flex flex-col gap-1 overflow-y-auto w-full max-w-md">
                {filteredGroups.map((group) => (
                    <Group key={group._id} group={group} />
                ))}
            </div>

            {open && <CreateGroupDialog setOpen={setOpen} open={open} />}
        </>
    )

}

export default Groups