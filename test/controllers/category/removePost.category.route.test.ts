import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { Category } from '../../../src/models/category.model';
import { CategoryServices } from '../../../src/services/category.services';
import { PostServices } from '../../../src/services/post.services';

describe('Category - Add Post | POST /category/removepost', () => {
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

        // Add post inside a category
        await CategoryServices.addPost(idCategory, idPost1);
        await CategoryServices.addPost(idCategory, idPost2);

    });

    it('Can remove post inside a category', async () => {
        const response = await request(app)
        .post('/category/removepost')
        .set({ token })
        .send({ 
            idPost: idPost2,
            idCategory
         });
         const { success, category, message } = response.body;
         equal(success, true);
         equal(category._id, idCategory);
         equal(category.posts.length, 1);
         equal(message, undefined);
        //  Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.posts.length, 1);
        equal(categoryDb.posts[0].toString(), idPost1);
    });

    it('Cannot do it without id post', async () => {
        const response = await request(app)
        .post('/category/removepost')
        .set({ token })
        .send({ 
            // idPost: idPost2,
            idCategory
         });
         const { success, category, message } = response.body;
         equal(success, false);
         equal(category, undefined);
         equal(message, 'INVALID_ID');
         equal(response.status, 400);
        //  Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.posts.length, 2);
    });

    it('Cannot do it without id category', async () => {
        const response = await request(app)
        .post('/category/removepost')
        .set({ token })
        .send({ 
            idPost: idPost2,
            // idCategory
         });
         const { success, category, message } = response.body;
         equal(success, false);
         equal(category, undefined);
         equal(message, 'INVALID_ID');
         equal(response.status, 400);
        //  Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.posts.length, 2);
    });

    it('Cannot remove post in a removed category', async () => {
        await CategoryServices.remove(idCategory);
        await request(app)
        .post('/category/removepost')
        .set({ token })
        .send({ 
            idPost: idPost2,
            idCategory
         });
        const response = await request(app)
        .post('/category/removepost')
        .set({ token })
        .send({ 
            idPost: idPost2,
            idCategory
         });
         const { success, category, message } = response.body;
         equal(success, false);
         equal(category, undefined);
         equal(message, 'CATEGORY_NOT_EXISTED');
         equal(response.status, 400);
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

});