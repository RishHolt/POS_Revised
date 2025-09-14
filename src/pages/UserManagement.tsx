import React, { useState, useMemo } from "react";
import { 
	Users, 
	Plus, 
	MoreVertical, 
	Edit, 
	Trash2, 
	UserCheck, 
	UserX,
	Mail,
	Phone,
	Calendar,
	Shield
} from "lucide-react";
import { usersData, userRoles, getUserRoleInfo } from "../mocks/userData";
import type { User } from "../mocks/userData";
import UserModal from "../components/modals/UserModal";
import { format } from "date-fns";
import PageHeader from "../components/ui/PageHeader";
import SearchAndFilters from "../components/ui/SearchAndFilters";
import Button from "../components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/Table";

const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>(usersData);
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	const filteredUsers = useMemo(() => {
		return users.filter(user => {
			const matchesSearch = 
				user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			const matchesStatus = statusFilter === "all" || user.status === statusFilter;
			
			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [users, searchTerm, roleFilter, statusFilter]);

	const handleAddUser = () => {
		setEditingUser(null);
		setIsModalOpen(true);
	};

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setIsModalOpen(true);
	};

	const handleSaveUser = (userData: Omit<User, 'id' | 'lastLogin'>) => {
		if (editingUser) {
			// Update existing user
			setUsers(prev => prev.map(user => 
				user.id === editingUser.id 
					? { ...userData, id: editingUser.id, lastLogin: editingUser.lastLogin }
					: user
			));
		} else {
			// Add new user
			const newUser: User = {
				...userData,
				id: (users.length + 1).toString(),
				lastLogin: undefined
			};
			setUsers(prev => [...prev, newUser]);
		}
	};

	const handleDeleteUser = (userId: string) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			setUsers(prev => prev.filter(user => user.id !== userId));
		}
	};

	const handleToggleStatus = (userId: string) => {
		setUsers(prev => prev.map(user => 
			user.id === userId 
				? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
				: user
		));
	};

	const getStatusBadge = (status: string) => {
		return status === 'active' 
			? 'bg-green-100 text-green-700'
			: 'bg-red-100 text-red-700';
	};

	const getRoleBadge = (role: string) => {
		const roleInfo = getUserRoleInfo(role);
		return roleInfo?.color || 'bg-gray-100 text-gray-700';
	};

	const actions = (
		<Button onClick={handleAddUser} icon={Plus}>
			Add User
		</Button>
	);

	const filters = (
		<>
			<select
				value={roleFilter}
				onChange={(e) => setRoleFilter(e.target.value)}
				className="px-4 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2"
			>
				<option value="all">All Roles</option>
				{userRoles.map(role => (
					<option key={role.value} value={role.value}>
						{role.label}
					</option>
				))}
			</select>

			<select
				value={statusFilter}
				onChange={(e) => setStatusFilter(e.target.value)}
				className="px-4 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2"
			>
				<option value="all">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</>
	);

	return (
		<div className="bg-[#F3EEEA] p-8 h-full overflow-y-auto custom-scrollbar">
			<PageHeader
				title="User Management"
				description="Manage users, roles, and permissions for your coffee shop"
				actions={actions}
			/>

			{/* Stats Cards */}
			<div className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8">
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div>
							<p className="font-medium text-[#776B5D]/70 text-sm">Total Users</p>
							<p className="font-bold text-[#776B5D] text-2xl">{users.length}</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<Users className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div>
							<p className="font-medium text-[#776B5D]/70 text-sm">Active Users</p>
							<p className="font-bold text-[#776B5D] text-2xl">
								{users.filter(u => u.status === 'active').length}
							</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<UserCheck className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div>
							<p className="font-medium text-[#776B5D]/70 text-sm">Admins</p>
							<p className="font-bold text-[#776B5D] text-2xl">
								{users.filter(u => u.role === 'admin').length}
							</p>
						</div>
						<div className="bg-red-100 p-3 rounded-full">
							<Shield className="w-6 h-6 text-red-600" />
						</div>
					</div>
				</div>

				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-center">
						<div>
							<p className="font-medium text-[#776B5D]/70 text-sm">Staff</p>
							<p className="font-bold text-[#776B5D] text-2xl">
								{users.filter(u => u.role !== 'admin').length}
							</p>
						</div>
						<div className="bg-purple-100 p-3 rounded-full">
							<Users className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>
			</div>

			<SearchAndFilters
				searchValue={searchTerm}
				onSearchChange={setSearchTerm}
				searchPlaceholder="Search by username, name, or email..."
				filters={filters}
			/>

			{/* Users Table */}
			<Table>
				<TableHeader>
					<tr>
						<TableCell header>User</TableCell>
						<TableCell header>Role</TableCell>
						<TableCell header>Status</TableCell>
						<TableCell header>Contact</TableCell>
						<TableCell header>Hire Date</TableCell>
						<TableCell header>Last Login</TableCell>
						<TableCell header>Actions</TableCell>
					</tr>
				</TableHeader>
				<TableBody>
					{filteredUsers.map((user) => (
						<TableRow key={user.id}>
							<TableCell>
								<div className="flex items-center">
									<div className="flex justify-center items-center bg-[#776B5D] rounded-full w-10 h-10 font-semibold text-white">
										{user.firstName[0]}{user.lastName[0]}
									</div>
									<div className="ml-3">
										<p className="font-medium text-[#776B5D]">
											{user.firstName} {user.lastName}
										</p>
										<p className="text-[#776B5D]/70 text-sm">{user.email}</p>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
									{getUserRoleInfo(user.role)?.label}
								</span>
							</TableCell>
							<TableCell>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
									{user.status.charAt(0).toUpperCase() + user.status.slice(1)}
								</span>
							</TableCell>
							<TableCell>
								<div className="space-y-1">
									{user.phone && (
										<div className="flex items-center text-[#776B5D] text-sm">
											<Phone className="mr-1 w-3 h-3" />
											{user.phone}
										</div>
									)}
									<div className="flex items-center text-[#776B5D] text-sm">
										<Mail className="mr-1 w-3 h-3" />
										{user.email}
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center text-sm">
									<Calendar className="mr-1 w-3 h-3" />
									{format(user.hireDate, 'MMM dd, yyyy')}
								</div>
							</TableCell>
							<TableCell>
								{user.lastLogin ? format(user.lastLogin, 'MMM dd, HH:mm') : 'Never'}
							</TableCell>
							<TableCell>
								<div className="relative">
									<button
										onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
										className="hover:bg-[#F3EEEA] p-2 rounded-lg transition-colors"
									>
										<MoreVertical className="w-4 h-4 text-[#776B5D]" />
									</button>
									
									{selectedUser === user.id && (
										<div className="top-8 right-0 z-10 absolute bg-white shadow-lg py-1 border border-[#B0A695]/20 rounded-lg min-w-32">
											<button
												onClick={() => {
													handleEditUser(user);
													setSelectedUser(null);
												}}
												className="flex items-center hover:bg-[#F3EEEA] px-4 py-2 w-full text-[#776B5D] text-sm text-left"
											>
												<Edit className="mr-2 w-3 h-3" />
												Edit
											</button>
											<button
												onClick={() => {
													handleToggleStatus(user.id);
													setSelectedUser(null);
												}}
												className="flex items-center hover:bg-[#F3EEEA] px-4 py-2 w-full text-[#776B5D] text-sm text-left"
											>
												{user.status === 'active' ? (
													<>
														<UserX className="mr-2 w-3 h-3" />
														Deactivate
													</>
												) : (
													<>
														<UserCheck className="mr-2 w-3 h-3" />
														Activate
													</>
												)}
											</button>
											<button
												onClick={() => {
													handleDeleteUser(user.id);
													setSelectedUser(null);
												}}
												className="flex items-center hover:bg-red-50 px-4 py-2 w-full text-red-600 text-sm text-left"
											>
												<Trash2 className="mr-2 w-3 h-3" />
												Delete
											</button>
										</div>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{filteredUsers.length === 0 && (
				<div className="py-12 text-center">
					<Users className="mx-auto mb-4 w-12 h-12 text-[#776B5D]/30" />
					<p className="text-[#776B5D]/70">No users found matching your criteria</p>
				</div>
			)}

			{/* User Modal */}
			<UserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveUser}
				editingUser={editingUser}
			/>
		</div>
	);
};

export default UserManagement;
