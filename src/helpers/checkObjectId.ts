import mongoose from 'mongoose';
import { MyError } from '../models/my-error.model';


export function checkObjectId(...ids: any[]) {
    try {
        ids.forEach(id => new mongoose.Types.ObjectId(id.toString()));
    } catch (error) {
        throw new MyError('INVALID_ID', 400);
    }
}
