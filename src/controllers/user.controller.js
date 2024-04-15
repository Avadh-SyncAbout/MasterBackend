import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from'../utils/cloudnary.js';
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, username, password} = req.body;
    // console.log("email", email);

    if ([fullName, email, username, password].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "All feilds are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    console.log(req.files);

    const avatarLacalPath = req.files && req.files.avatar && req.files.avatar[0] ? req.files.avatar[0].path : undefined;
    const coverImageLacalPath = req.files && req.files.coverImage && req.files.coverImage[0] ? req.files.coverImage[0].path : undefined;

    if (!avatarLacalPath) {
        throw new ApiError(400, "Avtar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLacalPath);
    const coverImage = await uploadOnCloudinary(coverImageLacalPath);

    if(!avatar) {
        throw new ApiError(400, "Avtar file is required");
    }

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created successfully")
    )

});

export { registerUser };