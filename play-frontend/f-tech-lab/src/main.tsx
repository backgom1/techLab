import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router";
import HomePage from "./components/features/auth/HomePage.tsx";
import LoginPage from "./components/features/auth/LoginPage.tsx";
import DashBoard from "./components/features/dashboard/DashBoard.tsx";
import RegisterPage from "./components/features/auth/RegisterPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "login",
                element: <LoginPage/>,
            },
            {
                path: "register",
                element: <RegisterPage/>,
            },
            {
                path: "dashboard",
                element: <DashBoard/>,
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
