const User = require("../models/user");

exports.updateUser = async (req, res) => {
    try {
      const { _id, ...updateData } = req.body;
      const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("🚀 ~ exports.deleteUser ~ id:", id)
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  

  exports.fetchUsers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page
      const skip = (page - 1) * limit;
  
      const users = await User.find({ access: { $ne: "superuser" } })
        .skip(skip)
        .limit(limit);
  
      const totalUsers = await User.countDocuments();
  
      if (!users.length) {
        return res.status(400).json({
          message: "No Users Found",
        });
      }
  
      return res.status(200).json({
        message: "User Data Fetched Successfully",
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
        },
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err.message || err,
      });
    }
  };
  