import {Request, Response, NextFunction} from "express";
import CategoryService from "./category.service";
import CategoryValidator from "./category.validator";

class CategoryController {
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryService.findAll();

            res.json({
                is_error: false,
                message: "success",
                categories,
            });
        } catch (e) {
            next(e);
        }
    }

    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const category = await CategoryService.findById(parseInt(id));

            res.json({
                is_error: false,
                message: "success",
                category,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            CategoryValidator.nameValidator(name)

            const [affectedCount] = await CategoryService.updateById(parseInt(id), name);

            if (affectedCount > 0) {
                res.status(200).json({
                    is_error: false,
                    message: "Category updated successfully",
                });
            } else {
                res.status(404).json({
                    is_error: true,
                    message: "Category not found",
                });
            }
        } catch (e) {
            next(e);
        }
    }

    async saveCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;

            CategoryValidator.nameValidator(name)

            const chatType = await CategoryService.save(name);

            res.status(201).json({
                is_error: false,
                message: "created",
                chatType,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await CategoryService.deleteById(parseInt(id));

            res.status(204).json({
                is_error: false,
                message: "deleted",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new CategoryController();