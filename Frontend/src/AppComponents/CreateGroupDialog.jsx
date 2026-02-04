import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CreateGroupDialog = ({ setOpen, open }) => {
    const otherUsers = useSelector((state) => state.auth.otherUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [file, setFile] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleToggleMember = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            toast.error("Group name is required");
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", groupName);
            formData.append("description", groupDescription);
            selectedMembers.forEach(id => {
              formData.append("members[]", id);
            });

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/groups/create`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success("✅ Group created successfully!");
                setOpen(false);
                setGroupName("");
                setGroupDescription("");    
                setSelectedMembers([]);
                setFile(null);
            }
        } catch (err) {
            console.error("Create Group Error:", err);
            toast.error(err.response?.data?.message || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a new Group</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 mt-2 bg-white p-1 rounded-2xl shadow-lg w-full max-w-md mx-auto"
                    encType="multipart/form-data"
                >
                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Group Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            className="w-full border border-gray-800 p-2 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-none shadow-sm"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    {/* Group Description */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Group Description
                        </label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            className="w-full border border-gray-800 p-2 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-none shadow-sm"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                        />
                    </div>

                    {/* Group Picture */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Group Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-800
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-slate-800 file:text-white
                                hover:file:bg-slate-700 cursor-pointer"
                        />
                    </div>


                    {/* Members Selection */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Select Members
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-2">
                            {otherUsers?.length > 0 ? (
                                otherUsers.map((user) => (
                                    <label
                                        key={user._id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(user._id)}
                                            onChange={() => handleToggleMember(user._id)}
                                            className="w-4 h-4 accent-slate-900"
                                        />
                                        <img
                                            src={user?.profilePic || "https://via.placeholder.com/40"}
                                            alt={user?.name}
                                            className="w-8 h-8 rounded-full object-cover border"
                                        />
                                        <span className="text-gray-700 font-medium">{user.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No other users found</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-slate-800 text-white text-center py-2 rounded-xl font-medium shadow-md hover:bg-slate-700 transition"
                    >
                        {loading ? (<span className="flex items-center justify-center"><Loader2 className="animate-spin" /> Loading</span>) : "Create Group"}
                    </button>
                </form>

            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupDialog;
