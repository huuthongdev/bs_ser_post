import { Post } from "../models/post.model";
import { checkObjectId } from "../helpers/checkObjectId";
import { MyError } from "../models/my-error.model";

export class PostServices {

    static async getAll() {
        return Post.find({ isActive: true })
    }

    static async getPostById(_id: string) {
        checkObjectId(_id);
        const post = await Post.findById(_id);
        if (!post) throw new MyError('POST_NOT_EXISTED', 404);
        return post;
    }

    static async addNew(idUser: string, title: string, excerpt: string, content: string, thumbnail: string) {
        checkObjectId(idUser);
        if (!title) throw new MyError('TITLE_MUST_BE_PROVIDED', 404);
        if (!content) throw new MyError('CONTENT_MUST_BE_PROVIDED', 404);
        const post = new Post({ title, excerpt, content, thumbnail, create_by: idUser });
        try {
            await post.save();
            return post;
        } catch (error) {
            throw new MyError('POST_IS_EXISTED', 400);
        }
    }

    static async update(idUser: string, _id: string, title: string, excerpt: string, content: string, thumbnail: string) {
        checkObjectId(idUser, _id);
        if (!title) throw new MyError('TITLE_MUST_BE_PROVIDED', 404);
        if (!content) throw new MyError('CONTENT_MUST_BE_PROVIDED', 404);
        const postOld: any = await Post.findById(_id);
        if (!postOld) throw new MyError('POST_NOT_EXISTED', 404);
        const postOldInfo = postOld.toObject();
        delete postOldInfo.modified;
        const timeStamp = {
            update_at: Date.now(),
            update_by: idUser
        }
        const post = await Post.findByIdAndUpdate(_id, { title, excerpt, content, thumbnail, timeStamp, $push: { modified: postOldInfo } }, { new: true });
        return post;
    }

    static async disablePost(idUser: string, _id: string) {
        checkObjectId(idUser, _id);
        const post = await Post.findByIdAndUpdate(_id, { isActive: false }, { new: true });
        if (!post) throw new MyError('POST_NOT_EXISTED', 404);
        return post;
    }

    static async remove(_id: string) {
        checkObjectId(_id);
        const post = await Post.findByIdAndRemove(_id);
        if (!post) throw new MyError('POST_NOT_EXISTED', 404);
        return post;
    }

}