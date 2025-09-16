import React, { useState, useEffect } from "react";
import { showConfirm } from "../utils/swal";
import {
	CircleChevronLeft,
	LayoutDashboard,
	ShoppingCart,
	Utensils,
	Package,
	BarChart,
	Users,
	User,
	Settings,
	LogOut,
	ScrollText
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, getUserDisplayName, getUserRole, clearCurrentUser, hasPermission } from "../utils/auth";

interface SidebarProps {
	open: boolean;
	onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState(getCurrentUser());
	
	useEffect(() => {
		setCurrentUser(getCurrentUser());
	}, [location.pathname]); // Update when route changes
	
	const handleLogout = async () => {
		const confirmed = await showConfirm("Logout", "Are you sure you want to logout?");
		if (confirmed) {
			clearCurrentUser();
			navigate("/");
			onToggle();
		}
	};
	
	if (!open) return null;
	return (
		<>
			<div
				className="z-10 fixed inset-0 bg-black/50"
				onClick={onToggle}
			/>
			<div className="top-0 left-0 z-20 fixed flex flex-col justify-between bg-[#776B5D] w-72 h-full">
				<div>
					<div className="flex justify-between items-center px-6 py-4">
						<div className="flex items-center gap-2">
							<h1 className="font-bold text-[#F3EEEA] text-2xl">
								Coffee Win
							</h1>
						</div>
						<button
							className="hover:bg-[#B0A695]/20 p-2 rounded-full transition-colors"
							onClick={onToggle}
						>
							<CircleChevronLeft className="w-6 h-6 text-[#F3EEEA]" />
						</button>
					</div>
					<hr className="mx-6 border-[#B0A695]" />
					<nav className="flex flex-col gap-4 mt-6 px-6">
						{hasPermission('View Dashboard') && (
							<Link
								to="/dashboard"
								className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
									location.pathname === "/dashboard"
										? "bg-[#F3EEEA] text-[#776B5D]"
										: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
								} transition-colors`}
							>
								<LayoutDashboard
									className={`w-6 h-6 ${
										location.pathname === "/dashboard"
											? "text-[#776B5D]"
											: "text-[#F3EEEA]"
									}`}
								/>
								Dashboard
							</Link>
						)}
						{hasPermission('Process Orders') && (
							<Link
								to="/POS"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/POS"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<ShoppingCart
													className={`w-6 h-6 ${
														location.pathname === "/POS"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								POS
							</Link>
						)}
						{hasPermission('Manage Order') && (
							<Link
								to="/Order"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/Order"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<ScrollText
													className={`w-6 h-6 ${
														location.pathname === "/Order"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								Order
							</Link>
						)}
						{hasPermission('View Menu') && (
							<Link
								to="/Menu"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/Menu"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<Utensils
													className={`w-6 h-6 ${
														location.pathname === "/Menu"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								Menu
							</Link>
						)}
						{hasPermission('Manage Inventory') && (
							<Link
								to="/Inventory"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/Inventory"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<Package
													className={`w-6 h-6 ${
														location.pathname === "/Inventory"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								Inventory
							</Link>
						)}
						{hasPermission('View Sales') && (
							<Link
								to="/Sales"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/Sales"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<BarChart
													className={`w-6 h-6 ${
														location.pathname === "/Sales"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								Sales
							</Link>
						)}
						{hasPermission('Manage Users') && (
							<Link
								to="/UserManagement"
												className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
													location.pathname === "/UserManagement"
														? "bg-[#F3EEEA] text-[#776B5D]"
														: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
												} transition-colors`}
							>
												<Users
													className={`w-6 h-6 ${
														location.pathname === "/UserManagement"
															? "text-[#776B5D]"
															: "text-[#F3EEEA]"
													}`}
								/>
								User Management
							</Link>
						)}
						<Link
							to="/Settings"
							className={`flex items-center gap-3 rounded-xl px-4 py-2 ${
								location.pathname === "/Settings"
									? "bg-[#F3EEEA] text-[#776B5D]"
									: "bg-[#776B5D] text-[#F3EEEA] border border-[#B0A695]"
							} transition-colors`}
						>
							<Settings
								className={`w-6 h-6 ${
									location.pathname === "/Settings"
										? "text-[#776B5D]"
										: "text-[#F3EEEA]"
								}`}
							/>
							Settings
						</Link>
					</nav>
				</div>
				<div className="px-4 pb-6">
					<div className="flex flex-col bg-[#F3EEEA] p-4 rounded-xl">
						<div className="flex items-center gap-3 mb-2">
							<span className="bg-[#EBE3D5] p-2 rounded-full">
								<User className="w-6 h-6 text-[#776B5D]" />
							</span>
							<div>
								<div className="font-semibold text-[#776B5D]">
									{currentUser ? getUserDisplayName() : 'Guest User'}
								</div>
								<div className="text-[#776B5D] text-xs">
									{currentUser ? getUserRole().charAt(0).toUpperCase() + getUserRole().slice(1) : 'Guest'}
								</div>
							</div>
						</div>
						<hr className="my-2 border-[#776B5D] w-full" />
						<div className="flex gap-2 w-full">
							<Link
								to="/Settings"
								className="flex flex-1 items-center gap-2 bg-[#776B5D] px-3 py-2 rounded-lg font-medium text-[#F3EEEA] text-sm hover:bg-[#776B5D]/90 transition-colors"
							>
								<Settings className="w-4 h-4" /> Settings
							</Link>
							<button
								className="flex flex-1 items-center gap-2 bg-[#776B5D] px-3 py-2 rounded-lg font-medium text-[#F3EEEA] text-sm hover:bg-[#776B5D]/90 transition-colors"
								onClick={handleLogout}
							>
								<LogOut className="w-4 h-4" /> Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;