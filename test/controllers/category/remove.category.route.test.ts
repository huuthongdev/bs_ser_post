import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { Category } from '../../../src/models/category.model';
import { CategoryServices } from '../../../src/services/category.services';

describe('Category - Remove | DELETE /category/:_id', () => {
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

    it('Can remove category', async () => {
        const response = await request(app)
        .delete('/category/' + idCategory)
        .set({ token });
        const { success, category, message } = response.body;
        equal(success, true);
        equal(category._id, idCategory);
        equal(category.name, 'tieude');
        equal(category.description, 'mota');
        equal(category.thumbnail, 'empty');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

    it('Cannot remove a category with invalid id', async () => {
        const response = await request(app)
        .delete('/category/' + 'idCategory')
        .set({ token });
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

    it('Cannot remove a category with invalid token || empty token', async () => {
        const response = await request(app)
        .delete('/category/' + idCategory)
        // .set({ token });
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

    it('Cannot remove a removed category', async () => {
        await Category.findByIdAndRemove(idCategory);
        const response = await request(app)
        .delete('/category/' + idCategory)
        .set({ token });
        const { success, category, message } = response.body;
        equal(success, false);
        equal(category, undefined);
        equal(message, 'CATEGORY_NOT_EXISTED');
        // Check category inside database
        const categoryDb: any = await Category.findOne({});
        equal(categoryDb, undefined);
    });

});