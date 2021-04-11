// MongoDB Connection
import mongoose from 'mongoose';
import * as config from '../configs';

mongoose.connect(config.TODOLIST_MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err) {
        if (err) throw err;
        console.log("connect MongoDB success!");
    }
);

export default mongoose;