import React, { useEffect, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { getCurrentUser, getUserDisplayName } from "../utils/auth";

interface HeaderProps {
	onToggleSidebar?: () => void;
	isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isMobile = false }) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [currentUser, setCurrentUser] = useState(getCurrentUser());

	useEffect(() => {
		const updateDateTime = () => {
			const now = new Date();
			const options: Intl.DateTimeFormatOptions = {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			};
			setDate(now.toLocaleDateString(undefined, options));
			setTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }));
		};
		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setCurrentUser(getCurrentUser());
	}, []);

	return (
		<header className="flex justify-between items-center bg-[#776B5D] shadow px-3 sm:px-6 py-4 w-full">
			{/* Left: Mobile menu button + Welcome */}
			<div className="flex items-center gap-3">
				{isMobile && onToggleSidebar && (
					<button
						onClick={onToggleSidebar}
						className="hover:bg-[#B0A695]/20 p-2 rounded-lg text-[#F3EEEA] transition-colors"
					>
						<Menu className="w-6 h-6" />
					</button>
				)}
				<span className="font-bold text-[#F3EEEA] text-lg sm:text-xl lg:text-2xl truncate">
					{isMobile ? `Hi, ${currentUser ? getUserDisplayName() : 'Guest'}!` : `Welcome, ${currentUser ? getUserDisplayName() : 'Guest'}!`}
				</span>
			</div>
			
			{/* Right: Icons + Info */}
			<div className="flex items-center gap-2 sm:gap-3">
				
				{/* Date and Time - responsive sizing */}
				<div className="hidden lg:flex items-center gap-2">
					<div className="bg-[#F3EEEA] shadow px-3 sm:px-4 py-2 rounded-lg font-medium text-[#776B5D] text-xs sm:text-sm whitespace-nowrap">
						{date}
					</div>
					<div className="bg-[#F3EEEA] shadow px-3 sm:px-4 py-2 rounded-lg font-medium text-[#776B5D] text-xs sm:text-sm">
						{time}
					</div>
				</div>
				
				{/* Mobile: Show only time */}
				<div className="lg:hidden bg-[#F3EEEA] shadow px-3 py-2 rounded-lg font-medium text-[#776B5D] text-xs">
					{time}
				</div>
				
				<button className="flex justify-center items-center bg-[#F3EEEA] hover:bg-[#B0A695]/20 shadow p-2 rounded-full transition-colors">
					<Bell className="w-5 sm:w-6 h-5 sm:h-6 text-[#776B5D]" />
				</button>
			</div>
		</header>
	);
};

export default Header;