import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Inventory from "../pages/Inventory";
import Dashboard from "../pages/Dashboard";
import POS from "../pages/POS";
import Menu from "../pages/Menu";
import Sales from "../pages/Sales";
import UserManagement from "../pages/UserManagement";
import Settings from "../pages/Settings";

const Layout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
	return (
		<div className="flex flex-row w-full h-dvh overflow-hidden">
			<Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />
			<div className="flex flex-col w-full h-full overflow-hidden">
				<Header onMenuClick={handleToggleSidebar} />
				<div className="flex-1 overflow-hidden">
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/POS" element={<POS />} />
						<Route path="/Menu" element={<Menu />} />
						<Route path="/Inventory" element={<Inventory />} />
						<Route path="/Sales" element={<Sales />} />
						<Route path="/UserManagement" element={<UserManagement />} />
						<Route path="/Settings" element={<Settings />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};

export default Layout;
