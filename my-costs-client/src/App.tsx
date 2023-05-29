import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import AuthPage from "./components/AuthPage/AuthPage";
import { Header } from "./components/Header/Header";
import { useStore } from "effector-react";
import { $auth, setAuth, setUsername } from "./context/auth";
import { $alert } from "./context/alert";
import Alert from "./components/Alert/Alert";
import { useEffect } from "react";
import { getAuthDataFromLocalStorage, removeUser } from "./utils/auth";
import CostsPage from "./components/CostsPage/CostPage";

function App() {
  const isLoggedIn = useStore($auth);
  const alert = useStore($alert);

  useEffect(() => {
    const auth = getAuthDataFromLocalStorage();

    if (!auth || !auth.access_token || !auth.refresh_token) {
      removeUser();
    } else {
      setAuth(true);
      setUsername(auth.username);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Navigate to="/costs" /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: isLoggedIn ? (
        <Navigate to="/costs" />
      ) : (
        <AuthPage type="login" />
      ),
    },
    {
      path: "/registration",
      element: isLoggedIn ? (
        <Navigate to="/costs" />
      ) : (
        <AuthPage type="registration" />
      ),
    },
    {
      path: "/costs",
      element: isLoggedIn ? <CostsPage /> : <Navigate to="/login" />,
    },
  ]);

  return (
    <div className="App">
      <Header />
      {alert.text && <Alert {...alert} />}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
