const User = require("../models/User.model");
const Url = require("../models/Url.model");
const Visit = require("../models/Visit.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/**
 * @desc Register User
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }
        
        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error"});
    };
};

/**
 * @desc Login User
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Login User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    };
};

/**
 * @desc Get Current User
 * @route GET /api/auth/profile
 * @access Private
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get Current User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    };
};

/**
 * @desc Update User Profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, username, email, avatar } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (email && email.toLowerCase() !== user.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ success: false, message: "Please enter a valid email" });
            }
            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            user.email = email.toLowerCase();
        }

        if (username && username.toLowerCase() !== user.username) {
            const existingUsername = await User.findOne({ username: username.toLowerCase() });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: "Username already taken" });
            }
            user.username = username.toLowerCase();
        }

        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * @desc Update Password
 * @route PUT /api/auth/password
 * @access Private
 */
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * @desc Delete Account
 * @route DELETE /api/auth/account
 * @access Private
 */
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete all associated URLs and Visits
        const userUrls = await Url.find({ user: req.user.id });
        const urlIds = userUrls.map(u => u._id);
        
        await Visit.deleteMany({ url: { $in: urlIds } });
        await Url.deleteMany({ user: req.user.id });
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    updatePassword,
    deleteAccount
};