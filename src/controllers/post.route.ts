import { Router } from "express";
import { mustBeUseStaff } from "./mustBeUse.middleware";
import { PostServices } from "../services/post.services";

export const postRouter = Router();


postRouter.get('/', (req, res: any) => {
    PostServices.getAll()
        .then(posts => res.send({ success: true, posts }))
        .catch(res.onError);
});

postRouter.use(mustBeUseStaff);

postRouter.post('/', (req: any, res: any) => {
    const { title, excerpt, content, thumbnail } = req.body;
    PostServices.addNew(req.idUser, title, excerpt, content, thumbnail)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});

postRouter.put('/:_id', (req: any, res: any) => {
    const { title, excerpt, content, thumbnail } = req.body;
    PostServices.update(req.idUser, req.params._id, title, excerpt, content, thumbnail)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});

postRouter.delete('/disable/:_id', (req: any, res: any) => {
    PostServices.disablePost(req.idUser, req.params._id)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});

postRouter.delete('/:_id', (req: any, res: any) => {
    PostServices.remove(req.params._id)
        .then(post => res.send({ success: true, post }))
        .catch(res.onError);
});
