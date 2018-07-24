import { User } from "../models/user.model";
import { MyError } from "../models/my-error.model";
import jwt from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";

// Helpers
import { validateEmail } from "../helpers/validateEmail";
import { checkObjectId } from "../helpers/checkObjectId";
import { sign, signForgotPassword, verify } from "../helpers/jwt";

const secrectKey = '120sadjaoczxklcj0912asidjdasijsadadszx12312';

export class UserServices {

    static async signUp(email: string, phone: string, plainPassword: string, role: string, name: string, address: string, birthday: Date, imgProfile: string) {
        // Check data request
        if (!email) throw new MyError('EMAIL_MUST_BE_PROVIDED', 404);
        if (validateEmail(email) === false) throw new MyError('WRONG_EMAIL_FORMAT', 404);
        if (!plainPassword) throw new MyError('PASSWORD_MUST_BE_PROVIDED', 404);
        if (plainPassword.length < 7) throw new MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);
        if (!role) throw new MyError('ROLE_MUST_BE_PROVIDED', 404);
        var checkRole = false;
        const roleArr = ['Client', 'Staff', 'Marketing'];
        for (let i = 0; i < roleArr.length; i++) {
            if (roleArr[i] === role) checkRole = true;
        };
        if (checkRole === false) throw new MyError('INVALID_ROLE_USER', 404);

        // Actions
        const password = await hash(plainPassword, 8);
        const profile = {
            name, address, birthday, imgProfile
        };
        const user = new User({ email, phone, password, role, profile });
        await user.save();
        const userInfo = user.toObject();
        userInfo.tokenVerify = jwt.sign({ _id: user._id }, secrectKey, { expiresIn: '7 days' });
        delete userInfo.password;
        return userInfo;
    }

    static async signUpAdmin(secrectKeyAdmin: string, email: string, plainPassword: string) {
        // Check Secrect key
        if (secrectKeyAdmin !== '120sadjaoczxklcj0912asidjdasijsadadszx12312') throw new MyError('ACCESS_IS_DENIDED', 400);

        // Check data request
        if (!email) throw new MyError('EMAIL_MUST_BE_PROVIDED', 404);
        if (validateEmail(email) === false) throw new MyError('WRONG_EMAIL_FORMAT', 404);
        if (!plainPassword) throw new MyError('PASSWORD_MUST_BE_PROVIDED', 404);
        if (plainPassword.length < 7) throw new MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);

        // Actions
        const password = await hash(plainPassword, 8);
        const user = new User({ email, password, role: 'Admin' });
        await user.save();
        const userInfo = user.toObject();
        userInfo.tokenVerify = jwt.sign({ _id: user._id }, secrectKey, { expiresIn: '7 days' });
        delete userInfo.password;
        return userInfo;
    }

    static async verifyUser(tokenVerify: string) {
        if (!tokenVerify) throw new MyError('TOKEN_VERIFY_MUST_BE_PROVIDED', 404);
        return jwt.verify(tokenVerify, secrectKey, async (error, obj: any) => {
            if (error) throw new MyError('INVALID_TOKEN', 400);
            const user: any = await User.findOneAndUpdate({ _id: obj._id, isActive: false }, { isActive: true }, { new: true });
            if (!user) throw new MyError('INVALID_TOKEN_VERIFY', 400);
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        });
    }

    static async login(infoLogin: string, plainPassword: string) {
        if (!infoLogin) throw new MyError('ID_LOGIN_MUST_BE_PROVIDED', 404);
        if (!plainPassword) throw new MyError('PASSWORD_MUST_BE_PROVIDED', 404);
        let user: any;
        if (validateEmail(infoLogin) === true) {
            // Login with email
            user = await User.findOne({ email: infoLogin });
        } else if (validateEmail(infoLogin) === false) {
            // Login with phone
            user = await User.findOne({ phone: infoLogin });
        };
        if (!user) throw new MyError('USER_NOT_EXISTED', 400);
        if (user.isActive === false) throw new MyError('USER_NOT_ACTIVE', 404);
        const same = await compare(plainPassword, user.password);
        if (!same) throw new MyError('ID_OR_PASSWORD_INCORRECT', 404);
        const userInfo = user.toObject();
        delete userInfo.password;
        userInfo.token = await sign({ _id: user._id });
        return userInfo;
    }

    static async changeRole(_id: string, role: string) {
        // Check info request
        checkObjectId(_id);
        if (!role) throw new MyError('ROLE_MUST_BE_PROVIDED', 404);
        var checkRole = false;
        const roleArr = ['Client', 'Staff', 'Marketing'];
        for (let i = 0; i < roleArr.length; i++) {
            if (roleArr[i] === role) checkRole = true;
        };
        if (checkRole === false) throw new MyError('INVALID_ROLE_USER', 404);
        // Actions
        const user: any = await User.findByIdAndUpdate(_id, { role }, { new: true });
        if (!user) throw new MyError('USER_NOT_EXISTED', 404);
        const userInfo = user.toObject();
        delete userInfo.password;
        return userInfo;
    }

    static async forgotPassword(email: string) {
        if (!email) throw new MyError('EMAIL_MUST_BE_PROVIDED', 404);
        if (validateEmail(email) === false) throw new MyError('WRONG_EMAIL_FORMAT', 404);
        const user: any = await User.findOne({ email });
        if (!user) throw new MyError('USER_NOT_EXISTED', 404);
        if (user.isActive === false) throw new MyError('USER_NOT_ACTIVE', 404);
        const tokenResetPass = await signForgotPassword({ _id: user._id });
        return tokenResetPass;
    }

    static async changePasswordForgot(tokenResetPass: string, plainPassword: string) {
        if (!plainPassword) throw new MyError('PASSWORD_MUST_BE_PROVIDED', 404);
        if (plainPassword.length < 7) throw new MyError('PASSWORD_LENGTH_MUST_BE_MORE_THAN_SEVEN_CHARACTERS', 404);
        const obj: any = await verify(tokenResetPass);
        const password = await hash(plainPassword, 8);
        const user = await User.findByIdAndUpdate(obj._id, { password }, { new: true });
        if (!user) throw new MyError('USER_NOT_EXISTED', 404);
        const userInfo = user.toObject();
        delete userInfo.password;
        return userInfo;
    }

    static async editProfile(idUser: string, name: string, address: string, birthday: Date, imgProfile: string) {
        checkObjectId(idUser);
        const profile = {
            name, address, birthday, imgProfile
        }
        const user = await User.findByIdAndUpdate(idUser, { profile }, { new: true })
        if (!user) throw new MyError('USER_NOT_EXISTED', 400);
        const userInfo = user.toObject();
        delete userInfo.password;
        return userInfo;
    }

}