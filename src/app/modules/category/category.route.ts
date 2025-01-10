import {Router} from "express";


import authMiddleware from "../../middlewares/auth.middleware";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";
import CategoryController from "./category.controller";

const route: Router = Router()

route.use(authMiddleware)
route.get("", CategoryController.getAllCategories)
route.get("/:id", CategoryController.getCategoryById)

route.use(roleCheckMiddleware)
route.post("", CategoryController.saveCategory)
route.patch("/:id", CategoryController.updateCategory)
route.delete("/:id", CategoryController.deleteCategory)

export default route