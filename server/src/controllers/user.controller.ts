import userStore, { UserStore } from '../stores/user.store'
import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcrypt';

export class UserController {
    private _userStore: UserStore;

    constructor(userStore: UserStore) {
        this._userStore = userStore;
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            let users = await this._userStore.getUsers()
            res.send(users).status(200).end();
        } catch (error) {
            console.log(error)
            res.send({ 'error': 'server error' }).status(500).end();
        }
    }

    addUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let newUser = req.body;

            // encrypt password
            let encryptedPassword = await bcrypt.hash(newUser.password, 8)
            newUser.password = encryptedPassword

            // save user to db
            await this._userStore.addUser(newUser)
            let users = await this._userStore.getUsers()
            res.send(users).status(200).end();

        } catch (error) {
            console.log(error)
            res.send({ 'error': 'server xxx' }).status(500).end();
        }
    }
}

export default new UserController(userStore);