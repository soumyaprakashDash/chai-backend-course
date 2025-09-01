
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details
  const { fullName, email, username, password } = req.body;

  // 2. Validate
  if ([fullName, email, username, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if user exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  // 4. Access uploaded files
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 5. Upload to Cloudinary
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  const coverUpload = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatarUpload || !avatarUpload.secure_url) {
    throw new ApiError(500, "Avatar upload failed, please try again later");
  }

  // 6. Create user
  const user = await User.create({
    fullName,
    avatar: avatarUpload.secure_url, //  correct key
    coverImage: coverUpload?.secure_url || "",
    email,
    username: username.toLowerCase(),
    password, // ensure password is hashed in User model
  });

  // 7. Sanitize user
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // 8. Response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
