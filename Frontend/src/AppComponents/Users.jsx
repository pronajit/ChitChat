import useGetOtherUsers from "../hooks/useGetOtherUsers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";


const Users = () => {
    useGetOtherUsers();

    const {otherUsers, searchValue} = useSelector((state) => state.auth);

    const [filteredUsers, setFilteredUsers] = useState(otherUsers);

    useEffect(()=>{
      if(!searchValue) {
         setFilteredUsers(otherUsers);
      } else {
         setFilteredUsers(
          otherUsers.filter(user => user.name.toLowerCase().includes(searchValue.toLowerCase()))
         );
      }
      
    }, [searchValue, otherUsers]);

    
  return (
    <div className="mt-3 flex flex-col gap-1 overflow-y-auto w-full max-w-md">
      {filteredUsers && filteredUsers.length > 0 && filteredUsers.map((user) => {
        return (
          <User key={user.id} user={user} />
        );
      })}
    </div>
  );
};

export default Users;
