import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import generateModel from '../utils/generateModel.js';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      name,
      password,
      loginMethod: 'Email',
    });

    // Create user's dynamic model
    const UserDataModel = generateModel(user._id);

    // Insert sample data
    await UserDataModel.create({
      title: 'Welcome to Your Dashboard!',
      description: 'This is your first sample entry. You can delete it.',
    });

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        loginMethod: user.loginMethod,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const googleUser = async (req, res) => {
  const { email, name, token } = req.body;

  try {
    // Validate required fields
    if (!email || !token) {
      return res.status(400).json({ message: 'Email and token are required' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists - return user data and token
      return res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          loginMethod: user.loginMethod,
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      });
    }

    // Create new user
    user = await User.create({
      email,
      name,
      loginMethod: 'Google',
    });

    // Create user's dynamic model
    const UserDataModel = generateModel(user._id);

    // Insert sample data
    await UserDataModel.create({
      title: 'Welcome to Your Dashboard!',
      description: 'This is your first sample entry. You can delete it.',
    });

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        loginMethod: user.loginMethod,
        createdAt: user.createdAt
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          loginMethod: user.loginMethod
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { registerUser, authUser, googleUser };