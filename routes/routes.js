import { Router } from 'express';
import HomeController from '../controllers/home.js';
import { LoginController, LogoutController, PostLoginController } from '../controllers/login.js';
import DashBoardController from '../controllers/dashboard.js'
import { authGuard, setTemplateVars } from '../middlewares/session.js';
import {RegisterController,PostRegisterController} from '../controllers/registration.js'
const appRouter = Router()

appRouter.use(setTemplateVars)

appRouter.get('/', HomeController);
appRouter.get('/login', LoginController);
appRouter.post('/login', PostLoginController);
appRouter.get('/logout', authGuard, LogoutController);
appRouter.get('/dashboard',authGuard, DashBoardController);
appRouter.get('/register',RegisterController)
appRouter.post('/register',PostRegisterController)

export default appRouter;
