import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { Category } from '../../../src/models/category.model';
import { CategoryServices } from '../../../src/services/category.services';
import { PostServices } from '../../../src/services/post.services';

describe('Category - Add Post | POST /category/addpost', () => {
    let idPost1: string, idPost2: string, idCategory: string, token: string, idUser: string;
    beforeEach('Prepare data for test', async () => {
        // Sign up a new User
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        const tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        await UserServices.verifyUser(tokenVerify);
        // Login User
        const userLogin: any = await UserServices.login('0908508136', 'Huuthong123');
        token = userLogin.token;
        // Add new category
        const category = await CategoryServices.addNew('tieude', 'mota', 'empty');
        idCategory = category._id;
        // Add new Post
        const post1 = await PostServices.addNew(idUser, 'post1', 'mota1', 'content1', 'empty');
        idPost1 = post1._id;
        const post2 = await PostServices.addNew(idUser, 'post2', 'mota2', 'content2', 'empty');
        idPost2 = post2._id;
        

    });

    it('Can add Post', async () => {
        const response = await request(app)
        .post('/category/addpost')
        .set({ token })
        .send({ idCategory, idPost: idPost1 });
        const { success, category, message } = response.body;
        equal(success, true);
        equal(category._id, idCategory);
        equal(category.posts[0], idPost1);
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.posts[0].toString(), idPost1);
    });

    it('Can add two Post', async () => {
        await request(app)
        .post('/category/addpost')
        .set({ token })
        .send({ idCategory, idPost: idPost1 });
        await request(app)
        .post('/category/addpost')
        .set({ token })
        .send({ idCategory, idPost: idPost2 });
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.posts[0].toString(), idPost1);
        equal(categoryDb.posts[1].toString(), idPost2);
    });

    it('Cannot add Post inside a category not existed', async () => {
        await Category.findByIdAndRemove(idCategory);
        const response = await request(app)
        .post('/category/addpost')
        .set({ token })
        .send({ idCategory, idPost: idPost1 });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(category, undefined);
        equal(message, 'CATEGORY_NOT_EXISTED');
        equal(response.status, 400);
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

});