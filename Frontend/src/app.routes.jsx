import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import RouteErrorBoundary from "./components/ErrorBoundary";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <RouteErrorBoundary />
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <RouteErrorBoundary />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>,
        errorElement: <RouteErrorBoundary />
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>,
        errorElement: <RouteErrorBoundary />
    }
]);
