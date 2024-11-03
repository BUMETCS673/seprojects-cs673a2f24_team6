// controllers/UserAccountController.js
const UserAccount = require('../models/UserAccount');
const UserProfile = require('../models/UserProfile');
const upload = require('../utils/upload');
const path = require('path');

create = (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ err: "Missing required fields" });
    }

    UserAccount.create({ email, username, password })
        .then(
            (result) => {
                console.log("success create user");
                res.status(200).json({ "Token": result.rows.insertId });
            },
            (err) => {
                console.log("fail create user");
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).json({ err: "user name or email already exist" });
                } else {
                    res.status(400).json({ err: err });
                }
            }
        );
};

login = (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        return res.status(400).json({ err: "missing not null value" });
    }

    const identifier = email || username;
    const type = email ? 'email' : 'username';

    UserAccount.checkCredentials(identifier, password, type)
        .then(
            (result) => {
                console.log("success login");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail login");
                res.status(400).json({ err: err });
            }
        );
};

getProfile = (req, res) => {
    UserProfile.findProfileByUserId(req.user.id)
        .then(
            (profile) => {
                console.log("success get profile");
                if (!profile) {
                    return res.status(404).json({ err: "Profile not found" });
                }
                res.status(200).json(profile);
            },
            (err) => {
                console.log("fail get profile");
                res.status(400).json({ err: err });
            }
        );
};

updateProfile = (req, res) => {
    const { height, weight } = req.body;

    if (height && (isNaN(height) || height <= 0)) {
        return res.status(400).json({ err: "Invalid height value" });
    }

    if (weight && (isNaN(weight) || weight <= 0)) {
        return res.status(400).json({ err: "Invalid weight value" });
    }

    UserProfile.update(req.user.id, req.body)
        .then(
            (result) => {
                console.log("success update profile");
                res.status(200).json({ msg: "Profile updated successfully" });
            },
            (err) => {
                console.log("fail update profile");
                res.status(400).json({ err: err });
            }
        );
};

updateAvatar = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ err: "No file uploaded" });
    }

    const avatarUrl = `/uploads/avatar/${req.file.filename}`;

    // First get the current avatar to delete later
    UserProfile.findCurrentAvatar(req.user.id)
        .then(
            (currentAvatar) => {
                // Update with new avatar
                return UserProfile.updateAvatar(req.user.id, avatarUrl)
                    .then(
                        (result) => {
                            console.log("success update avatar");
                            
                            // Delete old avatar if it exists
                            if (currentAvatar) {
                                const oldAvatarPath = path.join(__dirname, '../public', currentAvatar);
                                upload.deleteFile(oldAvatarPath);
                            }

                            res.status(200).json({
                                msg: "Avatar updated successfully",
                                avatar_url: avatarUrl
                            });
                        },
                        (err) => {
                            console.log("fail update avatar");
                            // Delete uploaded file if update fails
                            upload.deleteFile(path.join(__dirname, '../public', avatarUrl));
                            res.status(400).json({ err: err });
                        }
                    );
            },
            (err) => {
                console.log("fail get current avatar");
                res.status(400).json({ err: err });
            }
        );
};

module.exports = {
    create,
    login,
    getProfile,
    updateProfile,
    updateAvatar
};