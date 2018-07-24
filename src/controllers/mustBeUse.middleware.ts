import { verify, verifyAdmin, verifyStaff } from "../helpers/jwt";

export function mustBeUse(req: any, res: any, next: any) {
    verify(req.headers.token)
    .then((user: any) => {
        req.idUser = user._id;
        next();
    })
    .catch(res.onError);
};

export function mustBeUseAdmin(req: any, res: any, next: any) {
    verifyAdmin(req.headers.token)
    .then((user: any) => {
        req.idUser = user._id;
        next();
    })
    .catch(res.onError);
};

export function mustBeUseStaff(req: any, res: any, next: any) {
    verifyStaff(req.headers.token)
    .then((user: any) => {
        req.idUser = user._id;
        next();
    })
    .catch(res.onError);
};