import jwt from 'jsonwebtoken';
import { MyError } from '../models/my-error.model';
import { User } from '../models/user.model';
const secrectKey = '120sadjaoczxklcj0912asidjdasijsadadszx12312';

export function sign(obj: any) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, secrectKey, { expiresIn: '2 days' }, (error, token: any) => {
            if (error) return reject(error);
            resolve(token);
        });
    });
}

export function signForgotPassword(obj: any) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, secrectKey, { expiresIn: '300000000' }, (error, token: any) => {
            if (error) return reject(error);
            resolve(token);
        });
    });
}

export function verify(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secrectKey, async (error, obj: any) => {
            if (error) return reject(new MyError('INVALID_TOKEN', 400));
            const user = await User.findById(obj._id);
            if (!user) return reject(new MyError('USER_NOT_EXISTED', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}

export function verifyAdmin(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secrectKey, async (error, obj: any) => {
            if (error) return reject(new MyError('INVALID_TOKEN', 400));
            const user: any = await User.findById(obj._id);
            if (!user) return reject(new MyError('USER_NOT_EXISTED', 400));
            if (user.role !== 'Admin') return reject(new MyError('ACCESS_IS_DENIDED', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}

export function verifyStaff(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secrectKey, async (error, obj: any) => {
            if (error) return reject(new MyError('INVALID_TOKEN', 400));
            const user: any = await User.findById(obj._id);
            if (!user) return reject(new MyError('USER_NOT_EXISTED', 400));
            var checkRole = false;
            const roleArr = ['Admin', 'Staff', 'Marketing'];
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] === user.role) checkRole = true;
            };
            if (checkRole === false) return reject(new MyError('ACCESS_IS_DENIDED', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}
