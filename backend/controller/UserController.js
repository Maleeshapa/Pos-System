const User = require("../model/User");
const Store = require("../model/Store");
const Switch = require("../model/Switch");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'users');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const userName = req.body.userName || 'user';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);

        const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeUserName}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('userImage');

// Create user
const createUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const {
                userTitle,
                userFullName,
                userName,
                userPassword,
                userType,
                userEmail,
                userNIC,
                userTP,
                userSecondTP,
                userAddress,
                storeId
            } = req.body;

            // Validate required fields
            if (
                !userTitle ||
                !userFullName ||
                !userName ||
                !userPassword ||
                !userType ||
                !userEmail ||
                !userNIC ||
                !userTP ||
                !userAddress ||
                !storeId
            ) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Validate store existence
            const store = await Store.findByPk(storeId);
            if (!store) {
                return res.status(400).json({ error: "Invalid store ID." });
            }

            // Check if user already exists by NIC
            const existingUser = await User.findOne({ where: { userNIC } });
            if (existingUser) {
                return res.status(400).json({ error: "A user with this NIC already exists." });
            }

            // Handle user image
            let userImage = null;
            if (req.file) {
                userImage = `${req.protocol}://${req.get('host')}/uploads/users/${req.file.filename}`;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

            // Create new user
            const newUser = await User.create({
                userTitle,
                userFullName,
                userName,
                userPassword: hashedPassword,
                userType,
                userEmail,
                userNIC,
                userTP,
                userSecondTP,
                userAddress,
                userImage,
                userStatus: "Active",
                store_storeId: storeId,
            });

            const userWithStore = await User.findByPk(newUser.userId, {
                include: [
                    {
                        model: Store,
                        as: 'store',
                    },
                ],
            });
            // Generate JWT token
            const token = jwt.sign(
                {
                    id: newUser.id,
                    userName: newUser.userName,
                    userType: newUser.userType,
                },
                secretKey,
                { expiresIn: "12h" }
            );

            // Return user data and token
            res.status(201).json({ userWithStore, token });
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                return res.status(400).json({ error: "Validation error", details: validationErrors });
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ error: "A user with this email or NIC already exists." });
            }

            res.status(500).json({ error: `An internal error occurred: ${error.message}` });
        }
    });
};

// Get all user
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                is_hidden: 0, // Only fetch users that are not hidden
            },
            include: [{
                model: Store,
                as: 'store',
            }],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Example function to hide a user
const hideUser = async (req, res) => {
    const { userId } = req.params; // Assuming you pass userId in the URL

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hide the user by setting is_hidden to 1
        user.is_hidden = 1;
        await user.save();

        res.json({ message: "User hidden successfully" });
    } catch (error) {
        console.error("Error hiding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: [
                {
                    model: Store,
                    as: 'store',
                },
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const { id } = req.params;
            const {
                userTitle,
                userFullName,
                userName,
                userPassword,
                userType,
                userEmail,
                userNIC,
                userTP,
                userSecondTP,
                userAddress,
                userStatus,
                storeId
            } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Hash new password if provided
            if (userPassword) {
                const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
                user.userPassword = hashedPassword;
            }

            // Handle user image replacement
            let userImage = user.userImage;
            if (req.file) {
                // Delete old image if it exists
                if (userImage) {
                    const oldImagePath = path.join(__dirname, '..', 'uploads', 'users', path.basename(userImage));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                userImage = `${req.protocol}://${req.get('host')}/uploads/users/${req.file.filename}`;
            }

            await user.update({
                userTitle,
                userFullName,
                userName,
                userPassword: user.userPassword,
                userType,
                userEmail,
                userNIC,
                userTP,
                userSecondTP,
                userAddress,
                userStatus,
                userImage,
                store_storeId: storeId
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user image if it exists
        if (user.userImage) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'users', path.basename(user.userImage));
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image file: ${err.message}`);
                    }
                });
            }
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const userLogin = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;

        // Check if both username and password are provided
        if (!userName || !userPassword) {
            return res.status(400).json({
                message_type: "error",
                message: "Username and password are required."
            });
        }

        // Fetch user by username
        const user = await User.findOne({ where: { userName } });

        // If user not found, send error response
        if (!user) {
            return res.status(404).json({
                message_type: "error",
                message: "Incorrect username or password."
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!passwordMatch) {
            return res.status(401).json({
                message_type: "error",
                message: "Incorrect username or password."
            });
        }

        // Check if the user's account is inactive
        if (user.user_status === "inactive") {
            return res.status(403).json({
                message_type: "error",
                message: "Your account is inactive. Please contact an admin for further information."
            });
        }

        // Generate JWT token if login is successful
        const token = jwt.sign(
            {
                userId: user.id,
                userName: user.userName,
                userType: user.userType
            },
            secretKey,
            { expiresIn: '6h' }
        );

        // Respond with success, token, and user details
        return res.status(200).json({
            message_type: "success",
            message: "User signed in successfully.",
            token,
            user: {
                id: user.id,
                userName: user.userName,
                userEmail: user.userEmail,
                userType: user.userType,
                userStatus: user.userStatus
            }
        });

    } catch (error) {
        // Handle any errors
        console.error("Error during login:", error);
        return res.status(500).json({
            message_type: "error",
            message: `An error occurred: ${error.message}`
        });
    }
};



// Get users by is_hidden status
const getUsersByHiddenStatus = async (req, res) => {
    try {
        const { is_hidden } = req.params; // Get is_hidden status from request parameters

        if (is_hidden !== '0' && is_hidden !== '1') {
            return res.status(400).json({ error: "Invalid is_hidden value. Use 0 (visible) or 1 (hidden)." });
        }

        // Fetch users based on is_hidden value
        const users = await User.findAll({
            where: {
                is_hidden: is_hidden
            },
            include: [{
                model: Store,
                as: 'store',
            }],
        });

        // Check if any users are found
        if (!users.length) {
            return res.status(404).json({ message: `No users found with is_hidden = ${is_hidden}.` });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    userLogin,
    hideUser,
    getUsersByHiddenStatus
}