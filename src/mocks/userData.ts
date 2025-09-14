export interface User {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	role: 'admin' | 'cashier' | 'barista';
	status: 'active' | 'inactive';
	phone?: string;
	hireDate: Date;
	lastLogin?: Date;
	// permissions: string[]; // Temporarily removed for testing
}

export const userRoles = [
	{ value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-700' },
	{ value: 'cashier', label: 'Cashier', color: 'bg-blue-100 text-blue-700' },
	{ value: 'barista', label: 'Barista', color: 'bg-green-100 text-green-700' }
];

// Temporarily commented out for testing
// export const userPermissions = {
// 	admin: [
// 		'View Dashboard',
// 		'Manage Users',
// 		'View Sales',
// 		'Manage Menu',
// 		'Manage Inventory',
// 		'Process Orders',
// 		'View Reports',
// 		'System Settings'
// 	],
// 	cashier: [
// 		'View Dashboard',
// 		'View Sales',
// 		'Process Orders',
// 		'View Reports'
// 	],
// 	barista: [
// 		'View Dashboard',
// 		'Process Orders',
// 		'View Menu'
// 	]
// };

// Mock user data
export const usersData: User[] = [
	{
		id: '1',
		username: 'admin',
		firstName: 'Maria',
		lastName: 'Santos',
		email: 'maria.santos@coffeeshop.com',
		role: 'admin',
		status: 'active',
		phone: '+63 912 345 6789',
		hireDate: new Date('2023-01-15'),
		lastLogin: new Date('2025-01-14T08:30:00'),
		// permissions: userPermissions.admin // Temporarily removed for testing
	},
	{
		id: '2',
		username: 'cashier',
		firstName: 'John',
		lastName: 'Dela Cruz',
		email: 'john.delacruz@coffeeshop.com',
		role: 'cashier',
		status: 'active',
		phone: '+63 917 123 4567',
		hireDate: new Date('2023-03-20'),
		lastLogin: new Date('2025-01-14T07:45:00'),
		// permissions: userPermissions.cashier // Temporarily removed for testing
	},
	{
		id: '3',
		username: 'barista',
		firstName: 'Ana',
		lastName: 'Garcia',
		email: 'ana.garcia@coffeeshop.com',
		role: 'barista',
		status: 'active',
		phone: '+63 918 987 6543',
		hireDate: new Date('2023-05-10'),
		lastLogin: new Date('2025-01-14T09:15:00'),
		// permissions: userPermissions.barista // Temporarily removed for testing
	},
	{
		id: '4',
		username: 'carlos.rodriguez',
		firstName: 'Carlos',
		lastName: 'Rodriguez',
		email: 'carlos.rodriguez@coffeeshop.com',
		role: 'cashier',
		status: 'active',
		phone: '+63 919 456 7890',
		hireDate: new Date('2023-07-08'),
		lastLogin: new Date('2025-01-13T16:20:00'),
		// permissions: userPermissions.cashier // Temporarily removed for testing
	},
	{
		id: '5',
		username: 'lisa.martinez',
		firstName: 'Lisa',
		lastName: 'Martinez',
		email: 'lisa.martinez@coffeeshop.com',
		role: 'barista',
		status: 'inactive',
		phone: '+63 920 111 2222',
		hireDate: new Date('2023-09-12'),
		lastLogin: new Date('2025-01-10T14:30:00'),
		// permissions: userPermissions.barista // Temporarily removed for testing
	},
	{
		id: '6',
		username: 'michael.tan',
		firstName: 'Michael',
		lastName: 'Tan',
		email: 'michael.tan@coffeeshop.com',
		role: 'admin',
		status: 'active',
		phone: '+63 921 333 4444',
		hireDate: new Date('2022-11-05'),
		lastLogin: new Date('2025-01-14T10:00:00'),
		// permissions: userPermissions.admin // Temporarily removed for testing
	}
];

export const getUserRoleInfo = (role: string) => {
	return userRoles.find(r => r.value === role) || userRoles[0];
};

// Temporarily commented out for testing
// export const getUserPermissions = (role: string) => {
// 	return userPermissions[role as keyof typeof userPermissions] || [];
// };
