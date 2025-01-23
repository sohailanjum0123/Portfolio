import { asyncHnadler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../Service/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHnadler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if ([fullName, userName, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "all fields required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format.");
  }

  const existedUser = await User.fineOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user alredy existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar image is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
  if (!createdUser) {
    throw new apiError(500, "something wrong by Server registering the user");
  }

  return res.status(201).json(
    new apiResponse(200,createdUser, "User Register Successfully")
  )

});

export { registerUser };
