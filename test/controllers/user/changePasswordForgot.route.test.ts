import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';
import { verify } from '../../../src/helpers/jwt';

describe('User - Forgot Password | POST /user/forgotpassword', () => {
    let tokenVerify: string, idUser: string, tokenForgot: string;
    beforeEach('Prepare data for test', async () => {
        // Sign up a new User
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        await UserServices.verifyUser(tokenVerify);
        // Request forgot password
        tokenForgot = (await UserServices.forgotPassword('huuthong.mgd@gmail.com')).toString();
    });

    it('Can change password forgot', async () => {
        const response = await request(app)
            .post('/user//forgotpassword/changepass')
            .send({
                tokenReset: tokenForgot,
                plainPassword: 'Huuthong_update_pass'
            });
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
        // Check login with new password
        const userCheckNewPass = await request(app)
            .post('/user/login')
            .send({ infoLogin: 'huuthong.mgd@gmail.com', plainPassword: 'Huuthong_update_pass' });
        equal(userCheckNewPass.body.success, true);
        equal(userCheckNewPass.body.user.profile.name, 'huuthong');
        equal(userCheckNewPass.body.user.profile.address, '76/6 tbg');
        equal(userCheckNewPass.body.user.profile.imgProfile, 'empty');
        equal(new Date(userCheckNewPass.body.user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userCheckNewPass.body.user.email, 'huuthong.mgd@gmail.com');
        equal(userCheckNewPass.body.user.phone, '0908508136');
        equal(userCheckNewPass.body.user.isActive, true);
    });

    it('Cannot change password without tokenReset', async () => {
        const response = await request(app)
            .post('/user//forgotpassword/changepass')
            .send({
                // tokenReset: tokenForgot,
                plainPassword: 'Huuthong_update_pass'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(response.status, 400);
    });

    it('Cannot change password without plainPassword', async () => {
        const response = await request(app)
            .post('/user//forgotpassword/changepass')
            .send({
                tokenReset: tokenForgot,
                // plainPassword: 'Huuthong_update_pass'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'PASSWORD_MUST_BE_PROVIDED');
        equal(response.status, 404);
    });

    it('Cannot update password with lengh of password less than 7 characters', async () => {
        const response = await request(app)
            .post('/user//forgotpassword/changepass')
            .send({
                tokenReset: tokenForgot,
                plainPassword: 'Huu'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS');
        equal(response.status, 404);
    });

    it('Cannot change password when user was removed', async () => {
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
            .post('/user//forgotpassword/changepass')
            .send({
                tokenReset: tokenForgot,
                plainPassword: 'Huuthong_updated'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'USER_NOT_EXISTED');
        equal(response.status, 400);
    });

});