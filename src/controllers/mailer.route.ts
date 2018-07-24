import { Router } from "express";
import { mailer } from "../services/mailer.services";
// import { mustBeUse } from "./mustBeUse.middleware";
export const mailerRouter = Router();


mailerRouter.get('/', (req, res: any) => {
    mailer('huuthong.mgd@gmail.com', 'test', '<h1>Test h1</h1>')
    .then(info => res.send({ success: true, info }))
    .catch(res.onError);
});