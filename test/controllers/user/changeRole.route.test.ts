import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';

describe('User - Change Role | POST /user/login', () => {
    let idUser: string, token: string, idUserAd: string, tokenAd: string;
    beforeEach('Prepare data for test', async () => {
        // Create new user normal
        const u = await UserServices.signUp('teo@gmail.com', '01672716602', 'teo2018', 'Client', 'teo', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        await UserServices.verifyUser(u.tokenVerify);
        const user = await UserServices.login('01672716602', 'teo2018');
        idUser = user._id;
        token = user.token;
        // Create admin user
        const uAd = await UserServices.signUpAdmin('120sadjaoczxklcj0912asidjdasijsadadszx12312', 'ad@gmail.com', 'ad12345');
        await UserServices.verifyUser(uAd.tokenVerify);
        const userAd = await UserServices.login('ad@gmail.com', 'ad12345');
        idUserAd = userAd._id;
        tokenAd = userAd.token;
    });

    it('Can change role', async () => {
        const response = await request(app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: 'Marketing' });
        const { success, user } = response.body;
        equal(success, true);
        equal(user.profile.name, 'teo');
        equal(user.profile.address, '76/6 tbg');
        equal(user.profile.imgProfile, 'empty');
        equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(user.email, 'teo@gmail.com');
        equal(user.phone, '01672716602');
        equal(user.isActive, true);
        equal(user.role, 'Marketing');
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb._id, user._id);
        equal(userDb.profile.name, 'teo');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'teo@gmail.com');
        equal(userDb.phone, '01672716602');
        equal(userDb.isActive, true);
        equal(userDb.role, 'Marketing');
    });

    it('Cannot change role without role', async () => {
        const response = await request(app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: '' });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'ROLE_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb.profile.name, 'teo');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'teo@gmail.com');
        equal(userDb.phone, '01672716602');
        equal(userDb.isActive, true);
        equal(userDb.role, 'Client');
    });

    it('Cannot change role with invalid role', async () => {
        const response = await request(app)
            .post('/user/role/' + idUser)
            .set({ token: tokenAd })
            .send({ role: 'Marketings' });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_ROLE_USER');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb.profile.name, 'teo');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'teo@gmail.com');
        equal(userDb.phone, '01672716602');
        equal(userDb.isActive, true);
        equal(userDb.role, 'Client');
    });

    it('Cannot change role with invalid id', async () => {
        const response = await request(app)
            .post('/user/role/' + 'idUser')
            .set({ token: tokenAd })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_ID');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb.profile.name, 'teo');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'teo@gmail.com');
        equal(userDb.phone, '01672716602');
        equal(userDb.isActive, true);
        equal(userDb.role, 'Client');
    });

    it('Cannot change role with user not admin role', async () => {
        const response = await request(app)
            .post('/user/role/' + 'idUser')
            .set({ token })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'ACCESS_IS_DENIDED');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb.profile.name, 'teo');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'teo@gmail.com');
        equal(userDb.phone, '01672716602');
        equal(userDb.isActive, true);
        equal(userDb.role, 'Client');
    });

    it('Cannot change role a removed user', async () => {
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
            .post('/user/role/' + 'idUser')
            .set({ token })
            .send({ role: 'Marketing' });
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'USER_NOT_EXISTED');
        equal(response.status, 400);
        // Check user inside database 
        const userDb: any = await User.findOne({ email: 'teo@gmail.com' });
        equal(userDb, undefined);
    });

});