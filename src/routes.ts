import { Router } from 'express';
import authRoute from './app/modules/auth/auth.route';
import groupRouter from './app/modules/group/group.route';
import subscriber_route from './app/modules/subscriber/subscriber.route';
import campaign_route from './app/modules/campaign/campaign.route';



const appRouter = Router();

const moduleRoutes = [
    { path: '/campaign', route: campaign_route },
    { path: "/auth", route: authRoute },
    { path: "/group", route: groupRouter },
    { path: "/subscriber", route: subscriber_route }

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;