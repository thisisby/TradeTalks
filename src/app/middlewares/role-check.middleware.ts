import {NextFunction, Request, Response} from "express";
import {UserRequest} from "../../context";
import {Roles} from "../modules/user/user.enum";

export default async function (req: Request, res: Response, next: NextFunction) {
    const {user} = req as UserRequest;

    if(user.role !== Roles.ADMIN) {
        res
            .status(400)
            .json({
                is_error: true,
                message: "unauthorization access!",
            });
        return;
    }


    next();
}
