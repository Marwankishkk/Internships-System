const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || "your_jwt_secret_key",
        { expiresIn }
    );
};
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const genrateRefreshToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken;
}

module.exports = { generateToken, verifyToken , genrateRefreshToken };