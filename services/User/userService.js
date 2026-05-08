const bcrypt = require('bcrypt');

const User = require('../../models/Auth/User.js');
const Student = require('../../models/Auth/Student.js');
const Company = require('../../models/Auth/Company.js');

const {
  createUser,
  getUserByEmail,
  createCompany,
  createStudent,
  deleteUserById
} = require('../../repositories/User/user.js');

const {
  generateToken,
  verifyToken
} = require('../../utils/jwt.js');

// REGISTER
const register = async (data) => {
  const { email, password, role } = data;
  if (!email || !password || !role) {
    throw new Error("Email, password, and role are required");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email,
    password: hashedPassword,
    role
  });

  try {
    if (role === "student") {
      await createStudent({
        user: user._id,
        name: data.name,
        nationalId: data.nationalId,
        city: data.city,
        gpa: data.gpa,
        major: data.major,
        bio: data.bio
      });
    }

    if (role === "company") {
      await createCompany({
        user: user._id,
        companyName: data.companyName,
        city: data.city,
        description: data.description
      });
    }

    return {
      message: "User created successfully"
    };

  } catch (err) {
    await deleteUserById(user._id);
    throw new Error("Profile creation failed: " + err.message);
  }
};
// LOGIN
const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken(
    {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenType: "access"
    },
    "1h"
);

  const refreshToken = generateToken(
    { userId: user._id,
      tokenType: "refresh"
     },
    "7d"
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  };
};

// REFRESH TOKEN
const refreshAccessToken = (token) => {
  if (!token) {
    throw new Error("No refresh token provided");
  }

  const decoded = verifyToken(token);

  const newAccessToken = generateToken(
    { userId: decoded.userId },
    "15m"
  );

  return { accessToken: newAccessToken };
};

module.exports = {
  register,
  login,
  refreshAccessToken
}; 