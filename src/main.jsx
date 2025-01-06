import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {CodeEditor , GithubCallback , Login , UserDashboard, Problems , HomePage , AuthLayout , Playground , Friends , FriendDashboard , Update} from "./index.js"
import { Provider } from 'react-redux';
import store from "./store/store";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <AuthLayout authentication={false}> <Login /> </AuthLayout>,
      },
      {
        path: "/auth/github/callback",
        element: <GithubCallback />,
      },
      {
        path: "/", 
        element: <AuthLayout authentication={false}> <HomePage /> </AuthLayout>,
      },
      {
        path: "/code-editor/:slug", 
        element: <AuthLayout authentication={true}> <CodeEditor /> </AuthLayout>,
      },
      {
        path: "/dashboard", 
        element: <AuthLayout authentication={true}> <UserDashboard /></AuthLayout>,
      },
      {
        path: "/friend-dashboard/:details", 
        element: <AuthLayout authentication={true}> <FriendDashboard /></AuthLayout>,
      },
      {
        path: "/problems", 
        element: <AuthLayout authentication={true}> <Problems /></AuthLayout>,
      },
      {
        path: "/playground", 
        element: <AuthLayout authentication={true}> <Playground /></AuthLayout>,
      },
      {
        path: "/update-details", 
        element: <AuthLayout authentication={true}> <Update /></AuthLayout>,
      },
      {
        path: "/friends", 
        element: <AuthLayout authentication={true}> <Friends /></AuthLayout>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
