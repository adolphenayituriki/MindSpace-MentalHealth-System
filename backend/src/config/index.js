require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspace',
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_production',
  nodeEnv: process.env.NODE_ENV || 'development',
};
