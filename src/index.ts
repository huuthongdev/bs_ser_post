import './helpers/connectDatabase';
import { app } from './app';

app.listen(process.env.PORT || 4000, () => {
    if (process.env.PORT) console.log('Server started | Production');
    else console.log('Server started: http://localhost:4000');
});