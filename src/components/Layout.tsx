import React, { useState, useEffect } from "react";
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
	const [isMobile, setIsMobile] = useState(false);
	
	const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth < 768) {
				setSidebarOpen(false);
			}
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	return (
		<div className="flex w-full h-dvh overflow-hidden relative">
			<Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} isMobile={isMobile} />
			
			{/* Mobile overlay */}
			{isMobile && (
				<div 
					className={`fixed inset-0 bg-black/0 z-20 transition-all duration-300 ease-in-out ${
						sidebarOpen ? 'bg-black/50' : 'pointer-events-none'
					}`}
					onClick={() => setSidebarOpen(false)}
				/>
			)}
			
			<div 
				className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
					isMobile 
						? 'w-full' 
						: sidebarOpen 
							? 'w-[calc(100%-18rem)] ml-[18rem]' 
							: 'w-[calc(100%-4rem)] ml-[4rem]'
				}`}
			>
				<Header onToggleSidebar={handleToggleSidebar} isMobile={isMobile} />
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
