import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a given user ID
 * @param {string} id - User ObjectId
 * @returns {string} JWT Token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};
