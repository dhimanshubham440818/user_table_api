import mongoose from 'mongoose';
import userDataSchema from '../models/userDataSchema.js';

const generateModel = (userId) => {
  const modelName = `user_${userId}_data`;
  
  // Check if model already exists
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  
  return mongoose.model(modelName, userDataSchema);
};

export default generateModel;