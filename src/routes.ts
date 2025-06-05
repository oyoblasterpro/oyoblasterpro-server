import { Router } from 'express';
import mailRouter from './app/modules/mail/mail.route';
import authRoute from './app/modules/auth/auth.route';



const appRouter = Router();

const moduleRoutes = [
    { path: '/mail', route: mailRouter },
    { path: "/auth", route: authRoute }

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;