import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { UserStore } from 'stores/user.store'
import * as config from '../configs'
import userStore from '../stores/user.store'

class Middleware {
     private _userStore: UserStore

     constructor(userStore: UserStore) {
          this._userStore = userStore
     }

     // check token - middleware
     verifyToken = async (req: Request, res: Response, next: NextFunction) => {
          let token = req.header("x-access-token");

          if (!token) {
               return res.status(403).send({
                    error: "No token provided!"
               }).end();
          }

          jwt.verify(token, config.SECRET, (err, decoded) => {
               if (err) {
                    return res.status(401).send({
                         error: "Unauthorized!"
                    }).end();
               }

               // attack id of user to req
               req["userId"] = decoded["id"]
               next();
          });
     }

     // check role is admin - middleware
     isAdmin = async (req: Request, res: Response, next: NextFunction) => {
          // get user with id attacked in previous middleware
          let user = await this._userStore.getUserById(req["userId"])
          console.log(user["role"])
          if (user["role"] == "admin") {
               next()
          }
          else {
               res.status(403).send({
                    error: "You don't have permission!"
               }).end();
          }
     };
}

export default new Middleware(userStore);