import { Router } from 'express';
import mailRouter from './app/modules/mail/mail.route';
import authRoute from './app/modules/auth/auth.route';
import groupRouter from './app/modules/group/group.route';
import subscriber_route from './app/modules/subscriber/subscriber.route';



const appRouter = Router();

const moduleRoutes = [
    { path: '/mail', route: mailRouter },
    { path: "/auth", route: authRoute },
    { path: "/group", route: groupRouter },
    { path: "/subscriber", route: subscriber_route }

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;