import userStore, { UserStore } from "../stores/user.store";
import { Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import * as config from '../configs'
import * as jwt from 'jsonwebtoken'

export class AuthController {
    private _userStore: UserStore;
    constructor(userStore: UserStore) {
        this._userStore = userStore;
    }

    login = async (req: Request, res: Response) => {
        let userCredentials = req.body;
        let user = await this._userStore.getUserByUsername(userCredentials.username);
        // console.log(user["password"])
        if (user) {
            if (bcrypt.compareSync(userCredentials.password, user["password"])) {
                var token = jwt.sign({ id: user["_id"] }, config.SECRET, {
                    expiresIn: 30 // 24 hours
                });
                res.send({
                    id: user["_id"],
                    name: user["name"],
                    token: token
                }).end()
            }
            else {
                res.send({ "error": "password is incorrect!" }).end()
            }
        }
        else {
            res.send({ "error": "username not found!" }).end()
        }
    }
}

export default new AuthController(userStore);