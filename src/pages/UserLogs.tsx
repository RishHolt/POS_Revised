import React, { useState, useMemo } from "react";
import { 
	Activity, 
	Download, 
	RefreshCw, 
	Clock,
	User,
	Shield,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Info
} from "lucide-react";
import { userLogsData, logCategories, logStatuses, getLogCategoryInfo, getLogStatusInfo } from "../mocks/userLogsData";
import PageHeader from "../components/ui/PageHeader";
import SearchAndFilters from "../components/ui/SearchAndFilters";
import Button from "../components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/Table";
import { format } from "date-fns";

const UserLogs: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [dateFilter, setDateFilter] = useState<string>("all");

	const filteredLogs = useMemo(() => {
		return userLogsData.filter(log => {
			const matchesSearch = 
				log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
			const matchesStatus = statusFilter === "all" || log.status === statusFilter;
			
			// Date filtering
			let matchesDate = true;
			if (dateFilter !== "all") {
				const now = new Date();
				const logDate = new Date(log.timestamp);
				
				switch (dateFilter) {
					case "today":
						matchesDate = logDate.toDateString() === now.toDateString();
						break;
					case "yesterday":
						const yesterday = new Date(now);
						yesterday.setDate(yesterday.getDate() - 1);
						matchesDate = logDate.toDateString() === yesterday.toDateString();
						break;
					case "week":
						const weekAgo = new Date(now);
						weekAgo.setDate(weekAgo.getDate() - 7);
						matchesDate = logDate >= weekAgo;
						break;
					case "month":
						const monthAgo = new Date(now);
						monthAgo.setMonth(monthAgo.getMonth() - 1);
						matchesDate = logDate >= monthAgo;
						break;
				}
			}
			
			return matchesSearch && matchesCategory && matchesStatus && matchesDate;
		});
	}, [searchTerm, categoryFilter, statusFilter, dateFilter]);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'success':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'failed':
				return <XCircle className="w-4 h-4 text-red-500" />;
			case 'warning':
				return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
			default:
				return <Info className="w-4 h-4 text-blue-500" />;
		}
	};

	const getRoleIcon = (role: string) => {
		switch (role) {
			case 'admin':
				return <Shield className="w-4 h-4 text-red-500" />;
			case 'cashier':
				return <User className="w-4 h-4 text-blue-500" />;
			case 'barista':
				return <User className="w-4 h-4 text-green-500" />;
			default:
				return <User className="w-4 h-4 text-gray-500" />;
		}
	};

	// Calculate statistics
	const totalLogs = userLogsData.length;
	const successLogs = userLogsData.filter(log => log.status === 'success').length;
	const failedLogs = userLogsData.filter(log => log.status === 'failed').length;
	const warningLogs = userLogsData.filter(log => log.status === 'warning').length;

	return (
		<div className="bg-[#F3EEEA] p-4 sm:p-6 lg:p-8 h-full overflow-y-auto custom-scrollbar">
			<PageHeader
				title="User Logs"
				description="Monitor user activities and system events across your coffee shop"
				actions={
					<>
						<Button icon={Download}>
							Export Logs
						</Button>
						<Button icon={RefreshCw}>
							Refresh
						</Button>
					</>
				}
			/>

			{/* Stats Cards */}
			<div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
				<div className="bg-white shadow-sm p-4 sm:p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-[#776B5D]/70 text-sm">Total Logs</p>
							<p className="font-bold text-[#776B5D] text-xl sm:text-2xl">{totalLogs}</p>
						</div>
						<div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
							<Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-4 sm:p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-[#776B5D]/70 text-sm">Successful</p>
							<p className="font-bold text-[#776B5D] text-xl sm:text-2xl">{successLogs}</p>
						</div>
						<div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
							<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-4 sm:p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-[#776B5D]/70 text-sm">Failed</p>
							<p className="font-bold text-[#776B5D] text-xl sm:text-2xl">{failedLogs}</p>
						</div>
						<div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
							<XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-4 sm:p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-[#776B5D]/70 text-sm">Warnings</p>
							<p className="font-bold text-[#776B5D] text-xl sm:text-2xl">{warningLogs}</p>
						</div>
						<div className="bg-yellow-100 p-2 sm:p-3 rounded-full flex-shrink-0">
							<AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
						</div>
					</div>
				</div>
			</div>

			<SearchAndFilters
				searchValue={searchTerm}
				onSearchChange={setSearchTerm}
				searchPlaceholder="Search by user, action, description, or IP address..."
				filters={
					<>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="px-4 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2"
						>
							{logCategories.map(category => (
								<option key={category.value} value={category.value}>
									{category.label}
								</option>
							))}
						</select>

						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-4 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2"
						>
							{logStatuses.map(status => (
								<option key={status.value} value={status.value}>
									{status.label}
								</option>
							))}
						</select>

						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className="px-4 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2"
						>
							<option value="all">All Time</option>
							<option value="today">Today</option>
							<option value="yesterday">Yesterday</option>
							<option value="week">Last 7 Days</option>
							<option value="month">Last 30 Days</option>
						</select>
					</>
				}
			/>

			{/* Logs Table */}
			<Table>
				<TableHeader>
					<tr>
						<TableCell header>Status</TableCell>
						<TableCell header>User</TableCell>
						<TableCell header>Action</TableCell>
						<TableCell header>Description</TableCell>
						<TableCell header>Category</TableCell>
						<TableCell header>IP Address</TableCell>
						<TableCell header>Timestamp</TableCell>
						<TableCell header>Details</TableCell>
					</tr>
				</TableHeader>
				<TableBody>
					{filteredLogs.map((log) => (
						<TableRow key={log.id}>
							<TableCell>
								<div className="flex items-center">
									{getStatusIcon(log.status)}
									<span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getLogStatusInfo(log.status).color}`}>
										{log.status.charAt(0).toUpperCase() + log.status.slice(1)}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center">
									{getRoleIcon(log.userRole)}
									<div className="ml-2">
										<p className="font-medium text-[#776B5D]">{log.userName}</p>
										<p className="text-[#776B5D]/70 text-sm">{log.userRole}</p>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<span className="font-medium text-[#776B5D]">{log.action}</span>
							</TableCell>
							<TableCell>
								<p className="text-[#776B5D] max-w-xs	 truncate">{log.description}</p>
							</TableCell>
							<TableCell>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogCategoryInfo(log.category).color}`}>
									{getLogCategoryInfo(log.category).label}
								</span>
							</TableCell>
							<TableCell>
								<span className="font-mono text-sm text-[#776B5D]">{log.ipAddress}</span>
							</TableCell>
							<TableCell>
								<div className="flex items-center text-sm">
									<Clock className="mr-1 w-3 h-3" />
									{format(log.timestamp, 'MMM dd, HH:mm')}
								</div>
							</TableCell>
							<TableCell>
								{log.details && (
									<div className="space-y-1">
										{log.details.orderId && (
											<div className="text-xs text-[#776B5D]/70">
												Order: {log.details.orderId}
											</div>
										)}
										{log.details.amount && (
											<div className="text-xs text-[#776B5D]/70">
												Amount: ₱{log.details.amount.toLocaleString()}
											</div>
										)}
										{log.details.reason && (
											<div className="text-xs text-red-600">
												{log.details.reason}
											</div>
										)}
										{log.details.previousValue && log.details.newValue && (
											<div className="text-xs text-[#776B5D]/70">
												{log.details.previousValue} → {log.details.newValue}
											</div>
										)}
									</div>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{filteredLogs.length === 0 && (
				<div className="py-12 text-center">
					<Activity className="mx-auto mb-4 w-12 h-12 text-[#776B5D]/30" />
					<p className="text-[#776B5D]/70">No logs found matching your criteria</p>
				</div>
			)}
		</div>
	);
};

export default UserLogs;

