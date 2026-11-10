import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Layout><Login /></Layout>
    },
    {
        path: "/register",
        element: <Layout><Register /></Layout>
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
]);
