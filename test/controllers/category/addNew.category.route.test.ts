import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { Category } from '../../../src/models/category.model';

describe('Category - Add New | POST /category', () => {
    let token: string, idUser: string;
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
    });

    it('Can add new', async () => {
        const response = await request(app)
            .post('/category')
            .set({ token })
            .send({
                name: 'category_name',
                description: 'mota',
                thumbnail: 'empty'
            });
        const { success, category, message } = response.body;
        equal(success, true);
        equal(category.name, 'category_name');
        equal(category.description, 'mota');
        equal(category.thumbnail, 'empty');
        equal(message, undefined);
        // Check category inside database 
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.name, 'category_name');
        equal(categoryDb.description, 'mota');
        equal(categoryDb.thumbnail, 'empty');
    });

    it('Cannot add new without name', async () => {
        const response = await request(app)
            .post('/category')
            .set({ token })
            .send({
                // name: 'category_name',
                description: 'mota',
                thumbnail: 'empty'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(message, 'NAME_MUST_BE_PROVIDED');
        equal(response.status, 404);
        equal(category, undefined);
        // Check category inside database 
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

    it('Cannot add new twice with a name', async () => {
        await request(app)
            .post('/category')
            .set({ token })
            .send({
                name: 'category_name',
                description: 'mota',
                thumbnail: 'empty'
            });
        const response = await request(app)
            .post('/category')
            .set({ token })
            .send({
                name: 'category_name',
                description: 'mota',
                thumbnail: 'empty'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(message, 'CATEGORY_IS_EXISTED');
        equal(response.status, 400);
        equal(category, undefined);
        // Check category inside database 
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.name, 'category_name');
        equal(categoryDb.description, 'mota');
        equal(categoryDb.thumbnail, 'empty');
    });

    it('Cannot add new with invalid token || empty token', async () => {
        const response = await request(app)
            .post('/category')
            // .set({ token })
            .send({
                name: 'category_name',
                description: 'mota',
                thumbnail: 'empty'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(response.status, 400);
        equal(category, undefined);
        // Check category inside database 
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });


});