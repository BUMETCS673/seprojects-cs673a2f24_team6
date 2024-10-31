// controllers/userAccount.controller.js
const UserAccount = require('../models/userAccount.model');
const UserProfile = require('../models/userProfile.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');

class UserAccountController {
    async login(req, res) {
        try {
            const { identifier, password } = req.body; // identifier can be email or username

            if (!identifier || !password) {
                return res.status(400).json({ error: "Credentials required" });
            }

            const user = await UserAccount.checkCredentials(identifier, password);
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const accessToken = generateAccessToken({ id: user.user_id });
            const refreshToken = generateRefreshToken({ id: user.user_id });

            res.cookie('refreshToken', refreshToken, { 
                httpOnly: true, 
                secure: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.json({ 
                success: true,
                accessToken,
                user: {
                    id: user.user_id,
                    email: user.user_email,
                    username: user.user_name
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Error during login"
            });
        }
    }

    async register(req, res) {
        try {
            const { email, username, password, profile } = req.body;

            // Validate input
            if (!email || !username || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Missing required fields"
                });
            }

            // Check if user exists
            const existingUser = await UserAccount.findByEmail(email) || 
                               await UserAccount.findByUsername(username);
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: "Email or username already in use"
                });
            }

            // Create user account
            const result = await UserAccount.create({
                email,
                username,
                password
            });

            const userId = result.rows.insertId;

            // Create user profile if provided
            if (profile) {
                await UserProfile.create({
                    user_id: userId,
                    ...profile
                });
            }

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                userId
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Error during registration"
            });
        }
    }

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({ error: "No refresh token" });
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);
            const accessToken = generateAccessToken({ id: decoded.id });

            res.json({ 
                success: true,
                accessToken 
            });
        } catch (error) {
            res.status(403).json({ 
                success: false,
                error: "Invalid refresh token" 
            });
        }
    }

    async getProfile(req, res) {
      try {
          // Get both user account and profile data
          const [user, profile] = await Promise.all([
              UserAccount.findById(req.user.id),
              UserProfile.findByUserId(req.user.id)
          ]);

          if (!user) {
              return res.status(404).json({
                  success: false,
                  message: 'User not found'
              });
          }

          // If profile doesn't exist, create an empty one
          if (!profile) {
              const newProfile = await UserProfile.create({
                  user_id: req.user.id
              });
              
              return res.json({
                  success: true,
                  data: {
                      user: {
                          email: user.user_email,
                          username: user.user_name,
                          role: user.user_role
                      },
                      profile: newProfile.rows[0]
                  }
              });
          }

          res.json({
              success: true,
              data: {
                  user: {
                      email: user.user_email,
                      username: user.user_name,
                      role: user.user_role
                  },
                  profile
              }
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error retrieving user profile',
              error: error.message
          });
      }
  }

  async updateProfile(req, res) {
      try {
          const { avatar_url, introduction, height, weight, fitness_level, fitness_goals, preferred_workout_time } = req.body;

          // Validate numeric inputs
          if (height && (isNaN(height) || height <= 0)) {
              return res.status(400).json({
                  success: false,
                  message: 'Invalid height value'
              });
          }

          if (weight && (isNaN(weight) || weight <= 0)) {
              return res.status(400).json({
                  success: false,
                  message: 'Invalid weight value'
              });
          }

          // Check if profile exists
          const existingProfile = await UserProfile.findByUserId(req.user.id);

          if (!existingProfile) {
              // Create new profile
              await UserProfile.create({
                  user_id: req.user.id,
                  avatar_url,
                  introduction,
                  height,
                  weight,
                  fitness_level,
                  fitness_goals,
                  preferred_workout_time
              });
          } else {
              // Update existing profile
              await UserProfile.update(req.user.id, {
                  avatar_url,
                  introduction,
                  height,
                  weight,
                  fitness_level,
                  fitness_goals,
                  preferred_workout_time
              });
          }

          // Get updated profile
          const updatedProfile = await UserProfile.findByUserId(req.user.id);

          res.json({
              success: true,
              message: 'Profile updated successfully',
              data: updatedProfile
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error updating profile',
              error: error.message
          });
      }
  }

  async updateAvatar(req, res) {
      try {
          // Assuming you're using a middleware for file upload
          if (!req.file) {
              return res.status(400).json({
                  success: false,
                  message: 'No image file provided'
              });
          }

          const avatarUrl = req.file.path; // Or your cloud storage URL
          
          await UserProfile.update(req.user.id, {
              avatar_url: avatarUrl
          });

          res.json({
              success: true,
              message: 'Avatar updated successfully',
              data: { avatar_url: avatarUrl }
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error updating avatar',
              error: error.message
          });
      }
  }

  async getBasicInfo(req, res) {
      try {
          const user = await UserAccount.findById(req.user.id);
          if (!user) {
              return res.status(404).json({
                  success: false,
                  message: 'User not found'
              });
          }

          res.json({
              success: true,
              data: {
                  email: user.user_email,
                  username: user.user_name,
                  role: user.user_role
              }
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              message: 'Error retrieving user information',
              error: error.message
          });
      }
  }
}

module.exports = new UserAccountController();