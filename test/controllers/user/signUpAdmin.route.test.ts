import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';

describe('User - Sign Up Admin | GET /signup/admin/:secrectKeyAdmin/:email/:plainPassword', () => {
    it('Can sign up admin user', async () => {
        const response = await request(app)
        .get('/user/signup/admin/120sadjaoczxklcj0912asidjdasijsadadszx12312/huuthong.mgd@gmail.com/Huuthong123');
        const { success, user } = response.body;
        equal(success, true);
        equal(user.email, 'huuthong.mgd@gmail.com');
        equal(user.password, undefined);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb._id, user._id);
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.role, 'Admin');
        equal(userDb.isActive, false);
    });

    it('Cannot sign up admin user with wrong secrectKeyAdmin', async () => {
        const response = await request(app)
        .get('/user/signup/admin/asdzxc/huuthong.mgd@gmail.com/Huuthong123');
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'ACCESS_IS_DENIDED');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    
});