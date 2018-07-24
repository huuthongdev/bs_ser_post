import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { PostServices } from '../../../src/services/post.services';

describe('Post - Update | PUT /post/:_id', () => {
    let idPost: string, token: string, idUser: string;
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

        // Add new Post
        const post: any = await PostServices.addNew(userLogin._id, 'tieude', 'tomtat', 'noidung', 'empty');
        idPost = post._id;
    });

    it('Can update', async () => {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = await request(app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post } = response.body;
        equal(success, true);
        equal(post._id, idPost);
        equal(post.title, 'tieude_updated');
        equal(post.excerpt, 'mota_updated');
        equal(post.content, 'noidung_updated');
        equal(post.thumbnail, 'thumbnail_updated');
        // Check post modified
        equal(post.modified[0].title, 'tieude');
        equal(post.modified[0].excerpt, 'tomtat');
        equal(post.modified[0].thumbnail, 'empty');

        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude_updated');
        equal(postDb.excerpt, 'mota_updated');
        equal(postDb.content, 'noidung_updated');
        equal(postDb.thumbnail, 'thumbnail_updated');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 1);
        equal(postDb.modified[0].title, 'tieude');
        equal(postDb.modified[0].excerpt, 'tomtat');
        equal(postDb.modified[0].thumbnail, 'empty');
    });

    it('Cannot update without title', async () => {
        const bodyRequest = {
            // title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = await request(app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'TITLE_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'tomtat');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
    });

    it('Cannot update without content', async () => {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            // content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = await request(app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'CONTENT_MUST_BE_PROVIDED');
        equal(response.status, 404);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'tomtat');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
    });

    it('Cannot update a removed post', async () => {
        await Post.findByIdAndRemove(idPost);
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = await request(app)
            .put('/post/' + idPost)
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'POST_NOT_EXISTED');
        equal(response.status, 404);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb, undefined);
    });

    it('Cannot update with invalid id', async () => {
        const bodyRequest = {
            title: 'tieude_updated',
            excerpt: 'mota_updated',
            content: 'noidung_updated',
            thumbnail: 'thumbnail_updated'
        };
        const response = await request(app)
            .put('/post/' + 'idPost')
            .set({ token })
            .send(bodyRequest);
        const { success, post, message } = response.body;
        equal(success, false);
        equal(post, undefined);
        equal(message, 'INVALID_ID');
        equal(response.status, 400);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'tomtat');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
    });

});