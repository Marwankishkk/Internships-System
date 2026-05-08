const User = require('../../models/Auth/User');

const createUser = (data) => {
  return User.create(data);
};

const getUserByEmail = (email) => {
  return User.findOne({ email });
};

const getUserById = (id) => {
  return User.findById(id);
};


//STUDENT
const Student = require('../../models/Auth/Student');

const createStudent = (data) => {
  return Student.create(data);
};
const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

const getStudentByUserId = (userId) => {
  return Student.findOne({ user: userId }).populate('user');
};


//COMPANY
const Company = require('../../models/Auth/Company');

const createCompany = (data) => {
  return Company.create(data);
};

const getCompanyByUserId = (userId) => {
  return Company.findOne(userId);
};


module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
  createStudent,
  getStudentByUserId,
  createCompany,
  getCompanyByUserId,

};
