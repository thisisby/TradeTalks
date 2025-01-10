import {Router} from "express";
import AuthRoute from "../modules/auth/auth.route"
import UserRoute from "../modules/user/user.route"
import AdminRoute from "../modules/admin/admin.route";
import LocationRoute from "../modules/location/location.route";
import ChatTypeRoute from "../modules/chat-type/chat-type.route";
import ChatRoute from "../modules/chat/chat.route";
import SubChatRoute from "../modules/sub-chat/sub-chat.route";
import CategoryRoute from "../modules/category/category.route";
import {MyChats} from "../modules/my-chat/my-chat.entity";
import MyChatRoute from "../modules/my-chat/my-chat.route";
import MessageRoute from "../modules/message/message.route";
import ComplaintRoute from "../modules/complaint/complaint.route";
import HealthCheckRoute from "../modules/health-check/health-check.route";
import HistoryRoute from "../modules/history/history.route";

const router: Router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoute,
    },
    {
        path: "/users",
        route: UserRoute,
    },
    {
        path: "/admin",
        route: AdminRoute,
    },
    {
        path: "/locations",
        route: LocationRoute,
    },
    {
        path: "/chat-types",
        route: ChatTypeRoute,
    },
    {
        path: "/chats",
        route: ChatRoute,
    },
    {
        path: "/subchats",
        route: SubChatRoute,
    },
    {
        path: "/categories",
        route: CategoryRoute,
    },
    {
        path: "/mychats",
        route: MyChatRoute,
    },
    {
        path: "/ws",
        route: MessageRoute,
    },
    {
        path: "/complaints",
        route: ComplaintRoute
    },
    {
        path: "/health-check",
        route: HealthCheckRoute
    },
    {
        path: "/history",
        route: HistoryRoute
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;