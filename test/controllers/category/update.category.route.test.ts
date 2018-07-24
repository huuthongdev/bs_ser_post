import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { Category } from '../../../src/models/category.model';
import { CategoryServices } from '../../../src/services/category.services';

describe('Category - Update | PUT /category/:_id', () => {
    let idCategory: string, token: string, idUser: string;
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
    });

    it('Can update category', async () => {
        const response = await request(app)
            .put('/category/' + idCategory)
            .set({ token })
            .send({
                description: 'mota_updated',
                thumbnail: 'thumbnail_updated'
            });
        const { success, category, message } = response.body;
        equal(success, true);
        equal(category.name, 'tieude');
        equal(category.description, 'mota_updated');
        equal(category.thumbnail, 'thumbnail_updated');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.name, 'tieude');
        equal(categoryDb.description, 'mota_updated');
        equal(categoryDb.thumbnail, 'thumbnail_updated');
    });

    it('Cannot update with invalid token || empty token', async () => {
        const response = await request(app)
            .put('/category/' + idCategory)
            // .set({ token })
            .send({
                description: 'mota_updated',
                thumbnail: 'thumbnail_updated'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(category, undefined);
        equal(message, 'INVALID_TOKEN');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.name, 'tieude');
        equal(categoryDb.description, 'mota');
        equal(categoryDb.thumbnail, 'empty');
    });

    it('Cannot update with invalid id', async () => {
        const response = await request(app)
            .put('/category/' + 'idCategory')
            .set({ token })
            .send({
                description: 'mota_updated',
                thumbnail: 'thumbnail_updated'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(category, undefined);
        equal(message, 'INVALID_ID');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb.name, 'tieude');
        equal(categoryDb.description, 'mota');
        equal(categoryDb.thumbnail, 'empty');
    });

    it('Cannot update a removed category', async () => {
        await Category.findByIdAndRemove(idCategory);
        const response = await request(app)
            .put('/category/' + idCategory)
            .set({ token })
            .send({
                description: 'mota_updated',
                thumbnail: 'thumbnail_updated'
            });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(category, undefined);
        equal(message, 'CATEGORY_NOT_EXISTED');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

});