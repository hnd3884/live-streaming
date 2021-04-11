import { ObjectID } from "mongodb";
import mongoose from "../dbconnection/mongo.dbconnection";
import userModel from "./models/user.model";

export class UserStore {
    private _userModel: mongoose.Model<mongoose.Document<any>>
    constructor(model: mongoose.Model<mongoose.Document<any>>) {
        this._userModel = model;
    }

    getUsers = async () => {
        try {
            return await this._userModel.find({}).exec();
        } catch (error) {
            console.log(error);
        }
    }

    addUser = async (newData: any) => {
        try {
            if(!newData["role"]){
                newData["role"] = "user"
            }
            var newUser = new this._userModel(newData);
            return await newUser.save()
        } catch (error) {
            console.log(error);
        }
    }

    getUserByUsername = async (username: String) => {
        try {
            return await this._userModel.findOne({ username: username }).exec();
        } catch (error) {
            console.log(error);
        }
    }

    getUserById = async (id: ObjectID) => {
        try {
            return await this._userModel.findById(id).exec();
        } catch (error) {
            console.log(error);
        }
    }
}

export default new UserStore(userModel);