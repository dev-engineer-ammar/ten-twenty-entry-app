import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { Login } from "../pages/Login";
import TimesheetList from "../pages/TimesheetsListPage";
import TimesheetDetailPage from "../pages/TimesheetDetailPage";



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />} >
                <Route path="/timesheets" element={<ProtectedRoute children={<TimesheetList/>} />} />
                                <Route path="/timesheets/:id" element={<ProtectedRoute children={<TimesheetDetailPage/>} />} />

            </Route>
        </Routes>

    );
};

export default AppRoutes;
