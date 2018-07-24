import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';

describe('User - Login | POST /user/login', () => {
    let tokenVerify: string, idUser: string;
    beforeEach('Prepare data for test', async () => {
        // Sign up a new User
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        await UserServices.verifyUser(tokenVerify);
    });

    it('Can login with email', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: 'huuthong.mgd@gmail.com',
                plainPassword: 'Huuthong123'
            });
        const { success, user } = response.body;
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

    it('Can login with phone', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '0908508136',
                plainPassword: 'Huuthong123'
            });
        const { success, user } = response.body;
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

    it('Cannot login without infoLogin', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                // infoLogin: '0908508136',
                plainPassword: 'Huuthong123'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'ID_LOGIN_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot login without plainPassword', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '0908508136',
                // plainPassword: 'Huuthong123'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'PASSWORD_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot login with wrong infoLogin', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '090850813612314',
                plainPassword: 'Huuthong123'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'USER_NOT_EXISTED');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot login with wrong password', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '0908508136',
                plainPassword: 'Huuthong12314142'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'ID_OR_PASSWORD_INCORRECT');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot login when user not verify email || disable account', async () => {
        await User.findByIdAndUpdate(idUser, { isActive: false });
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '0908508136',
                plainPassword: 'Huuthong123'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'USER_NOT_ACTIVE');
        equal(response.status, 404);
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

    it('Cannot login with a removed user', async () => {
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
            .post('/user/login')
            .send({
                infoLogin: '0908508136',
                plainPassword: 'Huuthong123'
            });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'USER_NOT_EXISTED');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined)
    });

});