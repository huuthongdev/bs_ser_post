import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';

describe('User - Verify | GET /user/verify/:token', () => {
    let tokenVerify: string;
    beforeEach('Prepare data for test', async () => {
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
    });

    it('Can verify user', async () => {
        const response = await request(app)
            .get('/user/verify/' + tokenVerify);
        const { success, user, message } = response.body;
        equal(success, true);
        equal(user.profile.name, 'huuthong');
        equal(user.profile.address, '76/6 tbg');
        equal(user.profile.imgProfile, 'empty');
        equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(user.email, 'huuthong.mgd@gmail.com');
        equal(user.phone, '0908508136');
        equal(user.isActive, true);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb._id, user._id);
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot verify user with invalid token verify', async () => {
        const response = await request(app)
            .get('/user/verify/' + 'tokenVerify');
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_TOKEN');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, false);
    });

});