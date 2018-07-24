import mongoose, { connection } from 'mongoose';

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'production') return '';
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/test';
    return 'mongodb://localhost/gogi_mongo';
}

mongoose.connect(getDatabaseUri())
.then(() => console.log('Database connected'))
.catch(error => {
    console.log(error.message);
    process.exit(1);
});