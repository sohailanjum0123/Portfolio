import { asyncHnadler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../Service/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw apiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHnadler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if ([fullName, userName, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "all fields required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format.");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user alredy existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

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

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Register Successfully"));
});

const loginUser = asyncHnadler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new apiError(400, "Please enter userDetail");
  }

  const user = await User.findOne({
    $or: [{ userName, email }],
  });

  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const isPassword = await user.isPasswordCorrect(password);
  if (!isPassword) {
    throw new apiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, { user: loggedInUser, accessToken, refreshToken })
    );
});

const logoutUser = asyncHnadler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged Out user successfully"));
});


const refreshAccessToken = asyncHnadler(async(req,res)=>{
  const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if(!incommingRefreshToken){
    throw new apiError(401,"Unauthorized request")
  }

  const decodedToken = jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id)

  if(!user){
    throw new apiError(401,"Invalid Refresh Token")
  }

  if(incommingRefreshToken!=user?.refreshToken){
    throw new apiError(401,"Refresh Token is Expired or User")
  }

  const {accessToken, newRefreshToken} = user.generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
  .cookie("accessToken",accessToken, options)
  .cookie("refreshToken",newRefreshToken, options)
  .json(
    new apiResponse(200, {
      accessToken,
      refreshToken: newRefreshToken
    },
  "AccessToken  refreshed"
  )
  )

})

export { registerUser, loginUser, logoutUser,refreshAccessToken };
