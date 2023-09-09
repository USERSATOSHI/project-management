import "./App.scss";
import DashBoard from "./Pages/dashboard";
import Login from "./Pages/login";
import { Routes, Route } from "react-router-dom";
import Register from "./Pages/register";
import Navbar from "./Components/navbar";
import { useState } from "react";
import Team from "./Pages/team";
import Project from "./Pages/project";

function App() {
    const [page, setPage] = useState("dashboard");
    return (
        <div className="app">
            {!["login", "register"].includes(page) && <Navbar page={page} />}
            <Routes>
                <Route path="/" element={<DashBoard setPage={setPage} />} />
                <Route path="/login" element={<Login setPage={setPage} />} />
                <Route
                    path="/register"
                    element={<Register setPage={setPage} />}
                />
                <Route path="/teams/:id" element={<Team />} />
                <Route path="/projects/:id" element={<Project />} />
            </Routes>
        </div>
    );
}

export default App;
