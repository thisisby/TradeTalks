import {Router} from "express";
import UserController from "./user.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import AuthController from "../auth/auth.controller";
import multer from "multer";
import ProfileController from "../profile/profile.controller";
import CommentController from "../comment/comment.controller";
import ChatController from "../chat/chat.controller";
import MyChatController from "../my-chat/my-chat.controller";

const route: Router = Router()

const upload = multer({dest: "uploads/"});

const profile_files = [
    {name: "main_photo", maxCount: 1},
    {name: "additional_photos", maxCount: 30},
]
route.use(authMiddleware)

route.get("/ban-info", UserController.getBanInfo)
route.get("/account", AuthController.getMe)
route.delete("/account", UserController.deleteMe)

route.get("/:id/account", UserController.getUserById)
route.patch("/account", upload.single("avatar"), UserController.updateUser)

// profile
route.post("/profile", upload.fields(profile_files), ProfileController.createProfile)
route.get("/profile", ProfileController.getMyProfiles)
route.patch("/profile/:profileId", upload.fields(profile_files), ProfileController.updateProfile)
route.get("/:id/profile", ProfileController.getProfiles)
route.delete("/:id/profile/:profileId", ProfileController.deleteProfile)
route.get("/:id/profile/:profileId", ProfileController.getProfile)

// comment
route.get("/profile/:profileId/comments", CommentController.getCommentsByProfileId)
route.post("/profile/:profileId/comments", CommentController.createComment)
route.patch("/profile/:profileId/comments/:commentId", CommentController.updateComment)
route.delete("/profile/:profileId/comments/:commentId", CommentController.deleteComment)

// likes
route.get("/profile/:profileId/likes", ProfileController.getLikes)
route.post("/profile/:profileId/likes", ProfileController.addLike)
route.delete("/profile/:profileId/likes", ProfileController.deleteLike)

//chats
route.get("/chats", ChatController.getMyChats)
route.post("/chats/history", ChatController.recordVisit)

// chats
route.post("/my-chats", MyChatController.createPersonalChat)
route.get("/my-chats", MyChatController.getSavedChats)

export default route