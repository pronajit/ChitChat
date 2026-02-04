// controllers/group.controller.js
const Group = require("../models/group.model");
const cloudinary = require("../Utils/cloudinary");
const getDataUri = require("../Utils/datauri");

const createGroup = async (req, res) => {
  try {
    const adminId = req.id;
    const { name, description, members = [] } = req.body;
    const file = req.file;

    if (!name || !description) return res.status(400).json({ success: false, message: "name and description are required" });

    // admin ko members me ensure karo
    const uniqueMembers = Array.from(new Set([...members.map(String), String(adminId)]));
    let groupPic = "";

    if(file){
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        groupPic = cloudResponse?.secure_url;
    }

    const group = await Group.create({
      name,
      description,
      members: uniqueMembers,
      createdBy: adminId,
      groupPic,
    });

    return res.status(201).json({message: "Group created successfully", success: true, group });
  } catch (error) {
    console.error("createGroup error:", error);
    return res.status(500).json({ success: false, message: "Failed to create group", error: error.message });
  }
};

const getMyGroups = async (req,res) =>{
  try {
    const userId = req.id;

    const groups = await Group.find({ members: userId }).populate("members");

    return res.status(200).json({ success: true,message : "Groups fetched successfully", groups });

  } catch (error) {
    console.error("getMyGroups error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch groups", error: error.message });
  }
}


const addMember = async (req, res) => {
  try {
    const adminId = req.id;
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    if (String(group.createdBy) !== String(adminId)) {
      return res.status(403).json({ success: false, message: "Only admin can add members" });
    }

    await Group.findByIdAndUpdate(groupId, { $addToSet: { members: userId } });
    const updated = await Group.findById(groupId).populate("members", "username profilePic");

    return res.status(200).json({message: "Member added successfully", success: true, group: updated });
  } catch (error) {
    console.error("addMember error:", error);
    return res.status(500).json({ success: false, message: "Failed to add member", error: error.message });
  }
};


const removeMember = async (req, res) => {
  try {
    const adminId = req.id;
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    if (String(group.createdBy) !== String(adminId)) {
      return res.status(403).json({ success: false, message: "Only admin can remove members" });
    }

    await Group.findByIdAndUpdate(groupId, { $pull: { members: userId } });
    const updated = await Group.findById(groupId).populate("members", "username profilePic");

    return res.status(200).json({message: "Member removed successfully", success: true, group: updated });
  } catch (error) {
    console.error("removeMember error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove member", error: error.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  addMember,
  removeMember,
};
