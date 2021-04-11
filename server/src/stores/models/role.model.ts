import mongoose from '../../dbconnection/mongo.dbconnection'

class Role {
    private _userSchema = new mongoose.Schema({
        isdone: {
            type: Boolean,
            required: true
        },
        description: String
    });

    public get getInstance() {
        return mongoose.model('roles', this._userSchema);
    }
}

export default new Role().getInstance;