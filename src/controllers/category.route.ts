import { Router } from "express";
import { mustBeUseStaff } from "./mustBeUse.middleware";
import { CategoryServices } from "../services/category.services";

export const categoryRouter = Router();

categoryRouter.use(mustBeUseStaff);

categoryRouter.get('/', (req, res: any) => {
    CategoryServices.getAll()
        .then(categories => res.send({ success: true, categories }))
        .catch(res.onError);
});

categoryRouter.post('/', (req, res: any) => {
    const { name, description, thumbnail } = req.body;
    CategoryServices.addNew(name, description, thumbnail)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});

categoryRouter.put('/:_id', (req, res: any) => {
    const { description, thumbnail } = req.body;
    CategoryServices.update(req.params._id, description, thumbnail)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});

categoryRouter.delete('/:_id', (req, res: any) => {
    CategoryServices.remove(req.params._id)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});

categoryRouter.post('/addpost', (req, res: any) => {
    const { idPost, idCategory } = req.body;
    CategoryServices.addPost(idCategory, idPost)
        .then(category => res.send({ success: true, category }))
        .catch(res.onError);
});

