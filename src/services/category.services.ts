import { Category } from "../models/category.model";
import { MyError } from "../models/my-error.model";
import { checkObjectId } from "../helpers/checkObjectId";

export class CategoryServices {

    static async getAll() {
        return await Category.find({});
    }

    static async addNew(name: string, description: string, thumbnail: string) {
        if (!name) throw new MyError('NAME_MUST_BE_PROVIDED', 404);
        const category = new Category({ name, description, thumbnail });
        try {
            await category.save();
            return category;
        } catch (error) {
            throw new MyError("CATEGORY_IS_EXISTED", 400);
        }
    }

    static async update(_id: string, description: string, thumbnail: string) {
        checkObjectId(_id);
        const category = await Category.findByIdAndUpdate(_id, { description, thumbnail }, { new: true });
        if (!category) throw new MyError('CATEGORY_NOT_EXISTED', 404);
        return category;
    }

    static async remove(_id: string) {
        checkObjectId(_id);
        const category = await Category.findByIdAndRemove(_id);
        if (!category) throw new MyError('CATEGORY_NOT_EXISTED', 400);
        return category;
    }

    static async addPost(idCategory: string, idPost: string) {
        checkObjectId(idCategory, idPost);
        const query = { _id: idCategory, posts: { $ne: idPost } };
        const category = await Category.findOneAndUpdate(query, { $addToSet: { posts: idPost } }, { new: true });
        if (!category) throw new MyError('CATEGORY_NOT_EXISTED', 400);
        return category;
    }

} 