import { User } from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        missing: 'Please provide a valid username, email and password',
      });
    }

    const isUsernameExisted = await User.findOne({ username });
    if (isUsernameExisted) {
      return res.status(400).json({
        username: 'Username already existed',
      });
    }

    const isEmailExisted = await User.findOne({ email });
    if (isEmailExisted) {
      return res.status(400).json({
        email: 'Email already existed',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      
    });

    const isUserCreated = await User.findById(user._id);
    if (!isUserCreated) {
      return res.status(500).json({
        message: 'Something went wrong',
      });
    }
    return res.status(201).json({
      message: 'Registration successful',
      user: isUserCreated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide a valid username and password',
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        user: 'User not found',
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        password: 'Password is not correct',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const option = {
      httpOnly: true,
      secure: true,
    };
    user.token = token
    await user.save()
    return res.cookie('token', token, option).json({
      message: 'User logged in successfully',
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User found',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { userRegister, userLogin, userLogout, getUser };
