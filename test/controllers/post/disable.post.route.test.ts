import request from 'supertest';
import { equal } from 'assert';
import { app } from '../../../src/app';
import { UserServices } from '../../../src/services/user.services';
import { Post } from '../../../src/models/post.model';
import { PostServices } from '../../../src/services/post.services';

describe('Post - Disable | DELETE /disable/:_id', () => {
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

    it('Can disable a post', async () => {
        const response = await request(app)
        .delete('/post/disable/' + idPost)
        .set({ token });
        const { success, post, message } = response.body;
        equal(success, true);
        equal(post._id, idPost);
        equal(post.title, 'tieude');
        equal(post.excerpt, 'tomtat');
        equal(post.content, 'noidung');
        equal(post.thumbnail, 'empty');
        equal(post.create_by, idUser);
        equal(post.modified.length, 0);
        // Check post inside database
        const postDb: any = await Post.findOne({});
        equal(postDb.title, 'tieude');
        equal(postDb.excerpt, 'tomtat');
        equal(postDb.content, 'noidung');
        equal(postDb.thumbnail, 'empty');
        equal(postDb.create_by.toString(), idUser);
        equal(postDb.modified.length, 0);
        equal(postDb.isActive, false);
    });

    it('Cannot disable post with invalid id', async () => {
        const response = await request(app)
        .delete('/post/disable/' + 'idPost')
        .set({ token });
        const { success, post, message } = response.body; 
        equal(success, false);
        equal(post, undefined);
        equal(response.status, 400);
        equal(message, 'INVALID_ID');
       // Check post inside database
       const postDb: any = await Post.findOne({});
       equal(postDb.title, 'tieude');
       equal(postDb.excerpt, 'tomtat');
       equal(postDb.content, 'noidung');
       equal(postDb.thumbnail, 'empty');
       equal(postDb.create_by.toString(), idUser);
       equal(postDb.modified.length, 0);
       equal(postDb.isActive, true);
    });

    it('Cannot disable post with invalid token', async () => {
        const response = await request(app)
        .delete('/post/disable/' + idPost)
        .set({ token: '123asd' });
        const { success, post, message } = response.body; 
        equal(success, false);
        equal(post, undefined);
        equal(response.status, 400);
        equal(message, 'INVALID_TOKEN');
       // Check post inside database
       const postDb: any = await Post.findOne({});
       equal(postDb.title, 'tieude');
       equal(postDb.excerpt, 'tomtat');
       equal(postDb.content, 'noidung');
       equal(postDb.thumbnail, 'empty');
       equal(postDb.create_by.toString(), idUser);
       equal(postDb.modified.length, 0);
       equal(postDb.isActive, true);
    });

    it('Cannot disable a removed post', async () => {
        await Post.findByIdAndRemove(idPost);
        const response = await request(app)
        .delete('/post/disable/' + idPost)
        .set({ token });
        const { success, post, message } = response.body; 
        equal(success, false);
        equal(post, undefined);
        equal(response.status, 404);
        equal(message, 'POST_NOT_EXISTED');
        const postDb: any = await Post.findOne({});
        equal(postDb, undefined);
    });

});