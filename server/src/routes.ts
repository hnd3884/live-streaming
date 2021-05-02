import userController, { UserController } from "./controllers/user.controller";
import authController, { AuthController } from "./controllers/auth.controller";
import { Application } from "express";
import middleware from './middlewares/middlewares'

class Router {
    private _app: Application
    private _userController: UserController
    private _authController: AuthController

    constructor(app: Application) {
        this._app = app;
        this._userController = userController;
        this._authController = authController;

        this.UserRoutesHandler();
        this.AuthenticationHandler();
    }

    UserRoutesHandler() {
        this._app.get('/users', this._userController.getUsers)

        // use middleware
        // this._app.post('/user/add', middleware.verifyToken, middleware.isAdmin, this._userController.addUser)
        this._app.post('/user/add', this._userController.addUser)
    }

    AuthenticationHandler() {
        this._app.post('/auth/login', this._authController.login)
    }
}

export default Router;