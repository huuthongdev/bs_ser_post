import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';
import { verify } from '../../../src/helpers/jwt';

describe('User - Forgot Password | POST /user/forgotpassword', () => {
    let tokenVerify: string, idUser: string;
    beforeEach('Prepare data for test', async () => {
        // Sign up a new User
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        await UserServices.verifyUser(tokenVerify);
    }); 

    it('Can request forgot pass', async () => {
        const response = await request(app)
        .post('/user/forgotpassword')
        .send({ email: 'huuthong.mgd@gmail.com' });
        const { success, tokenReset } = response.body;
        equal(success, true);
        const obj: any = await verify(tokenReset);
        equal(obj._id, idUser);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb._id, obj._id);
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

    it('Cannot request forgot pass without email', async () => {
        const response = await request(app)
        .post('/user/forgotpassword')
        .send({ email: '' });
        const { success, tokenReset, message } = response.body;
        equal(success, false);
        equal(tokenReset, undefined);
        equal(message, 'EMAIL_MUST_BE_PROVIDED');
        equal(response.status, 404);
    });

    it('Cannot request forgot pass with wrong email format', async () => {
        const response = await request(app)
        .post('/user/forgotpassword')
        .send({ email: 'huuthonggmail.com' });
        const { success, tokenReset, message } = response.body;
        equal(success, false);
        equal(tokenReset, undefined);
        equal(message, 'WRONG_EMAIL_FORMAT');
        equal(response.status, 404);
    });

    it('Cannot request forgot pass with a user not existed', async () => {
        const response = await request(app)
        .post('/user/forgotpassword')
        .send({ email: 'huu@gmail.com' });
        const { success, tokenReset, message } = response.body;
        equal(success, false);
        equal(tokenReset, undefined);
        equal(message, 'USER_NOT_EXISTED');
        equal(response.status, 404);
    });

});