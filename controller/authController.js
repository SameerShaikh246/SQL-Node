const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user Type", 400);
  }

  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const result = await user.findOne({
    attributes: [
      "id",
      "userType",
      "firstName",
      "lastName",
      "email",
      "password",
    ], // Specify columns to include
    where: {
      email: email,
      deletedAt: {
        [Op.is]: null, // Ensure deletedAt is NULL
      },
    },
    limit: 1, // Limit to one result
  });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const userWithoutPassword = { ...result.toJSON() }; // Convert the result to a plain object
  delete userWithoutPassword.password; // Remove the password field

  // Generate a token
  const token = generateToken({
    id: result.id,
  });

  // Send response
  return res.json({
    status: "success",
    user: userWithoutPassword,
    token,
  });
});

module.exports = { signup, login };
