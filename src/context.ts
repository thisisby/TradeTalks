import { Request } from "express";
import { User } from "./app/modules/user/user.entity";

export type UserRequest = Request & { user: User; locals: Date };
