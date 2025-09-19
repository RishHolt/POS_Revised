import React, { useState, useEffect } from "react";
import { showConfirm } from "../utils/swal";
import {
	ChevronLeft,
	ChevronRight,
	LayoutDashboard,
	ShoppingCart,
	Utensils,
	Package,
	BarChart,
	Users,
	User,
	Settings,
	LogOut,
	ScrollText,
	Activity
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, getUserDisplayName, getUserRole, clearCurrentUser, hasPermission } from "../utils/auth";

interface SidebarProps {
	open: boolean;
	onToggle: () => void;
	isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, isMobile = false }) => {
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
		}
	};

	const menuItems = [
		{
			path: "/dashboard",
			icon: LayoutDashboard,
			label: "Dashboard",
			permission: "View Dashboard"
		},
		{
			path: "/POS",
			icon: ShoppingCart,
			label: "POS",
			permission: "Process Orders"
		},
		{
			path: "/Order",
			icon: ScrollText,
			label: "Order",
			permission: "Manage Order"
		},
		{
			path: "/Menu",
			icon: Utensils,
			label: "Menu",
			permission: "View Menu"
		},
		{
			path: "/Inventory",
			icon: Package,
			label: "Inventory",
			permission: "Manage Inventory"
		},
		{
			path: "/Sales",
			icon: BarChart,
			label: "Sales",
			permission: "View Sales"
		},
		{
			path: "/UserManagement",
			icon: Users,
			label: "User Management",
			permission: "Manage Users"
		},
		{
			path: "/UserLogs",
			icon: Activity,
			label: "User Logs",
			permission: "View Reports"
		},
	];

	return (
		<div className={`fixed left-0 top-0 h-full bg-[#776B5D] transition-all duration-300 ease-in-out z-30 ${
			isMobile 
				? (open ? 'w-72 opacity-100 translate-x-0' : 'w-72 opacity-0 -translate-x-full') 
				: (open ? 'w-72' : 'w-17')
		}`}>
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center justify-between p-4 h-18 border-b border-[#B0A695]/30">
					<div className={`transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
						{open && (
							<h1 className="font-bold text-[#F3EEEA] text-xl whitespace-nowrap">
								Coffee Win
							</h1>
						)}
					</div>
					<button
						onClick={onToggle}
						className="p-2 rounded-lg hover:bg-[#B0A695]/20 transition-colors"
					>
						{open ? (
							<ChevronLeft className="w-5 h-5 text-[#F3EEEA]" />
						) : (
							<ChevronRight className="w-5 h-5 text-[#F3EEEA]" />
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-3 py-4 space-y-2">
					{menuItems.map((item) => {
						if (item.permission && !hasPermission(item.permission)) return null;
						
						const isActive = location.pathname === item.path;
						const Icon = item.icon;
						
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
									isActive
										? "bg-[#F3EEEA] text-[#776B5D] shadow-sm"
										: "text-[#F3EEEA] hover:bg-[#B0A695]/20"
								}`}
								title={!open ? item.label : ""}
							>
								<Icon className={`w-5 h-5 flex-shrink-0 ${
									isActive ? "text-[#776B5D]" : "text-[#F3EEEA]"
								}`} />
								<span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
									open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
								}`}>
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				{/* User Section */}
				<div className="p-3 border-t border-[#B0A695]/30">
					<div className={`transition-all duration-300 ease-in-out ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
						{open ? (
							<div className="bg-[#F3EEEA] p-3 rounded-lg">
								<div className="flex items-center gap-3 mb-3">
									<div className="bg-[#EBE3D5] p-2 rounded-full">
										<User className="w-5 h-5 text-[#776B5D]" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-semibold text-[#776B5D] text-sm truncate">
											{currentUser ? getUserDisplayName() : 'Guest User'}
										</div>
										<div className="text-[#776B5D]/70 text-xs">
											{currentUser ? getUserRole().charAt(0).toUpperCase() + getUserRole().slice(1) : 'Guest'}
										</div>
									</div>
								</div>
								<div className="flex gap-2">
									<Link
										to="/Settings"
										className="flex-1 flex items-center justify-center gap-2 bg-[#776B5D] px-3 py-2 rounded-lg font-medium text-[#F3EEEA] text-xs hover:bg-[#776B5D]/90 transition-colors"
									>
										<Settings className="w-4 h-4" />
										Settings
									</Link>
									<button
										onClick={handleLogout}
										className="flex-1 flex items-center justify-center gap-2 bg-[#776B5D] px-3 py-2 rounded-lg font-medium text-[#F3EEEA] text-xs hover:bg-[#776B5D]/90 transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Logout
									</button>
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								<Link
									to="/Settings"
									className="flex items-center justify-center p-2 rounded-lg text-[#F3EEEA] hover:bg-[#B0A695]/20 transition-colors"
									title="Settings"
								>
									<Settings className="w-5 h-5" />
								</Link>
								<button
									onClick={handleLogout}
									className="flex items-center justify-center p-2 rounded-lg text-[#F3EEEA] hover:bg-[#B0A695]/20 transition-colors"
									title="Logout"
								>
									<LogOut className="w-5 h-5" />
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;