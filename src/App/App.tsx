import { Menu } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { RequestStatusType } from "app/app-reducer";
import { useAppDispatch, useAppSelector } from "app/store";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "features/Login/Login";
import { authMe, logoutWatcher } from "features/Login/auth/auth-reducer";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { useLayoutEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const isLoggedIn: boolean = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useLayoutEffect(() => {
    dispatch(authMe());
  }, []);

  const onCLickToggleLog = () => {
    if (isLoggedIn) {
      dispatch(logoutWatcher());
    } else {
      navigate("login");
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Button onClick={onCLickToggleLog} color="inherit">
            {isLoggedIn ? "logout" : "login"}
          </Button>
        </Toolbar>
        {status === "loading" && <LinearProgress color={"inherit"} />}
      </AppBar>
      <Container fixed>
        <ErrorSnackbar />
      </Container>
      <Routes>
        <Route path={"/"} element={<TodolistsList />} />
        <Route path={"login"} element={<Login />} />
        <Route path={"404"} element={<h1>404. PAGE NOT FOUND</h1>} />
        <Route path={"*"} element={<Navigate to={"404"} />} />
      </Routes>
    </div>
  );
}
export default App;
