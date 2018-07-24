export class MyError extends Error {
    constructor(message: string, public statusCode: any) {
        super(message);
    }
}