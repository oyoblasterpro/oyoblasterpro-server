import { Router } from 'express';
import mailRouter from './app/modules/mail/mail.route';



const appRouter = Router();

const moduleRoutes = [
    { path: '/mail', route: mailRouter },

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;