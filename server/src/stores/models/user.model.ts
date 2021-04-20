import mongoose from '../../dbconnection/mongo.dbconnection'

class User {
    private _userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: String,
        gender: String,
        email: String,
        role: String
    });

    public get getModel() {
        return mongoose.model('users', this._userSchema);
    }
}

export default new User().getModel;