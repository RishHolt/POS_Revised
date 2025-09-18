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
import UserLogs from "../pages/UserLogs";
import Settings from "../pages/Settings";
import Order from "../pages/Order";

const Layout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
	return (
		<div className="flex w-full h-dvh overflow-hidden">
			<Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />
			<div 
				className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
				style={{
					width: sidebarOpen ? 'calc(100% - 18rem)' : 'calc(100% - 4rem)',
					marginLeft: sidebarOpen ? '18rem' : '4rem'
				}}
			>
				<Header />
				<div className="flex-1 w-full overflow-hidden">
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/POS" element={<POS />} />
						<Route path="/Menu" element={<Menu />} />
						<Route path="/Inventory" element={<Inventory />} />
						<Route path="/Sales" element={<Sales />} />
						<Route path="/Order" element={<Order />} />
						<Route path="/Order/:id" element={<Order />} />
						<Route path="/UserManagement" element={<UserManagement />} />
						<Route path="/UserLogs" element={<UserLogs />} />
						<Route path="/Settings" element={<Settings />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};

export default Layout;
