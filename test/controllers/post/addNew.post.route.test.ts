import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';

describe('Post - Add New | POST /post', () => {
    let token: string, idUser: string;
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
    });

    it('Can add new', async () => {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung',
            thumbnail: 'empty'
        }
        const response = await request(app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post } = response.body;
        equal(success, true);
        equal(post.title, 'tieude');
        equal(post.excerpt, 'mota');
        equal(post.content, 'noidung');
        equal(post.thumbnail, 'empty');
        equal(post.create_by, idUser);
        equal(post.modified.length, 0);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'mota');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
    });

    it('Cannot add new without title', async () => {
        const bodyRequest = {
            // title: 'tieude',
            excerpt: 'mota',
            content: 'noidung'
        }
        const response = await request(app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'TITLE_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb, undefined);
    });

    it('Cannot add new without content', async () => {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            // content: 'noidung'
        }
        const response = await request(app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'CONTENT_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb, undefined);
    });

    it('Cannot add new without token', async () => {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung'
        }
        const response = await request(app)
            .post('/post')
            // .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'INVALID_TOKEN');
        equal(response.status, 400);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb, undefined);
    });

    it('Cannot add new twice with a title', async () => {
        const bodyRequest = {
            title: 'tieude',
            excerpt: 'mota',
            content: 'noidung',
            thumbnail: 'empty'
        }
        await request(app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const response = await request(app)
            .post('/post')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(message, 'POST_IS_EXISTED');
        equal(response.status, 400);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'mota');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
    });


});