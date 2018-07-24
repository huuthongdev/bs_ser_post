import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';
import { UserServices } from '../../../src/services/user.services';

describe('User - Edit Profile | POST /user/edit', () => {
    let token: string, idUser: string;
    beforeEach('Prepare data for test', async () => {
        // Sign up a new User
        const user: any = await UserServices.signUp('huuthong.mgd@gmail.com', '0908508136', 'Huuthong123', 'Staff', 'huuthong', '76/6 tbg', new Date(1996, 11, 12, 3, 30, 0, 0), 'empty');
        const tokenVerify = user.tokenVerify;
        idUser = user._id;
        // Verify user
        await UserServices.verifyUser(tokenVerify);
        // Login user
        const userLogin: any = await UserServices.login('0908508136', 'Huuthong123');
        token = userLogin.token;
    });

    it('Can edit profile', async () => {
        const bodyRequest = {
            name: 'thong_updated',
            address: 'address_updated',
            birthday: new Date(2018, 11, 12, 3, 30, 0, 0),
            imgProfile: 'imgProfile_updated'
        }
        const response = await request(app)
            .post('/user/edit')
            .set({ token })
            .send(bodyRequest);
        const { success, user, message } = response.body;
        equal(success, true);
        equal(user.profile.name, 'thong_updated');
        equal(user.profile.address, 'address_updated');
        equal(user.profile.imgProfile, 'imgProfile_updated');
        equal(new Date(user.profile.birthday.toString()), new Date(2018, 11, 12, 3, 30, 0, 0).toString());
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb._id, user._id);
        equal(userDb.profile.name, 'thong_updated');
        equal(userDb.profile.address, 'address_updated');
        equal(userDb.profile.imgProfile, 'imgProfile_updated');
        equal(new Date(userDb.profile.birthday.toString()), new Date(2018, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.isActive, true);
    });

});