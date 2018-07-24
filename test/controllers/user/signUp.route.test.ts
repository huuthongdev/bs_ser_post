import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { User } from '../../../src/models/user.model';

describe('User - Sign Up | POST /user/signup ', () => {

    it('Can sign up new user', async () => {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, user, message } = response.body;
        equal(success, true);
        equal(user.profile.name, 'huuthong');
        equal(user.profile.address, '76/6 tbg');
        equal(user.profile.imgProfile, 'empty');
        equal(new Date(user.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(user.email, 'huuthong.mgd@gmail.com');
        equal(user.phone, '0908508136');
        equal(user.role, 'Staff');
        equal(user.isActive, false);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb._id, user._id);
        equal(userDb.profile.name, 'huuthong');
        equal(userDb.profile.address, '76/6 tbg');
        equal(userDb.profile.imgProfile, 'empty');
        equal(new Date(userDb.profile.birthday.toString()), new Date(1996, 11, 12, 3, 30, 0, 0).toString());
        equal(userDb.email, 'huuthong.mgd@gmail.com');
        equal(userDb.phone, '0908508136');
        equal(userDb.role, 'Staff');
        equal(userDb.isActive, false);
    });

    it('Cannot sign up without email', async () => {
        const bodyRequest = {
            // email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'EMAIL_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    it('Cannot sign up with wrong email format', async () => {
        const bodyRequest = {
            email: 'huuthong.mgdgmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'WRONG_EMAIL_FORMAT');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    it('Cannot sign up without plainPassword', async () => {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            // plainPassword: 'Huuthong123',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'PASSWORD_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    it('Cannot signup with lengh of password less than 7 characters', async () => {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huu',
            role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    it('Cannot sign up without role', async () => {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            // role: 'Staff',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'ROLE_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });

    it('Cannot sign up with invalid role || not Client/Staff/Marketing', async () => {
        const bodyRequest = {
            email: 'huuthong.mgd@gmail.com',
            phone: '0908508136',
            plainPassword: 'Huuthong123',
            role: 'Admins',
            name: 'huuthong',
            address: '76/6 tbg',
            birthday: new Date(1996, 11, 12, 3, 30, 0, 0),
            imgProfile: 'empty'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(bodyRequest);
        const { success, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_ROLE_USER');
        equal(response.status, 404);
        // Check user inside database 
        const userDb: any = await User.findOne({});
        equal(userDb, undefined);
    });
 
});
