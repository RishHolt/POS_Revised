export interface UserLog {
	id: string;
	userId: string;
	userName: string;
	userRole: 'admin' | 'cashier' | 'barista';
	action: string;
	description: string;
	category: 'authentication' | 'sales' | 'inventory' | 'user_management' | 'system' | 'order';
	ipAddress: string;
	userAgent: string;
	timestamp: Date;
	status: 'success' | 'failed' | 'warning';
	details?: {
		orderId?: string;
		itemId?: string;
		amount?: number;
		previousValue?: string;
		newValue?: string;
		reason?: string;
	};
}

export const logCategories = [
	{ value: 'all', label: 'All Categories', color: 'bg-gray-100 text-gray-700' },
	{ value: 'authentication', label: 'Authentication', color: 'bg-blue-100 text-blue-700' },
	{ value: 'sales', label: 'Sales', color: 'bg-green-100 text-green-700' },
	{ value: 'inventory', label: 'Inventory', color: 'bg-orange-100 text-orange-700' },
	{ value: 'user_management', label: 'User Management', color: 'bg-purple-100 text-purple-700' },
	{ value: 'system', label: 'System', color: 'bg-red-100 text-red-700' },
	{ value: 'order', label: 'Order Processing', color: 'bg-yellow-100 text-yellow-700' }
];

export const logStatuses = [
	{ value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-700' },
	{ value: 'success', label: 'Success', color: 'bg-green-100 text-green-700' },
	{ value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-700' },
	{ value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700' }
];

// Mock user logs data
export const userLogsData: UserLog[] = [
	{
		id: '1',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'LOGIN',
		description: 'User logged in successfully',
		category: 'authentication',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T08:30:00'),
		status: 'success'
	},
	{
		id: '2',
		userId: '2',
		userName: 'John Dela Cruz',
		userRole: 'cashier',
		action: 'CREATE_ORDER',
		description: 'Created new order #ORD-001',
		category: 'order',
		ipAddress: '192.168.1.101',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T08:45:00'),
		status: 'success',
		details: {
			orderId: 'ORD-001',
			amount: 150.00
		}
	},
	{
		id: '3',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'UPDATE_INVENTORY',
		description: 'Updated coffee beans stock from 50kg to 75kg',
		category: 'inventory',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T09:15:00'),
		status: 'success',
		details: {
			itemId: 'COFFEE-001',
			previousValue: '50kg',
			newValue: '75kg'
		}
	},
	{
		id: '4',
		userId: '3',
		userName: 'Ana Garcia',
		userRole: 'barista',
		action: 'PROCESS_ORDER',
		description: 'Processed order #ORD-001',
		category: 'order',
		ipAddress: '192.168.1.102',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T09:20:00'),
		status: 'success',
		details: {
			orderId: 'ORD-001'
		}
	},
	{
		id: '5',
		userId: '2',
		userName: 'John Dela Cruz',
		userRole: 'cashier',
		action: 'PROCESS_PAYMENT',
		description: 'Processed payment for order #ORD-001',
		category: 'sales',
		ipAddress: '192.168.1.101',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T09:25:00'),
		status: 'success',
		details: {
			orderId: 'ORD-001',
			amount: 150.00
		}
	},
	{
		id: '6',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'CREATE_USER',
		description: 'Created new user: Carlos Rodriguez',
		category: 'user_management',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T10:00:00'),
		status: 'success',
		details: {
			newValue: 'Carlos Rodriguez (cashier)'
		}
	},
	{
		id: '7',
		userId: '4',
		userName: 'Carlos Rodriguez',
		userRole: 'cashier',
		action: 'LOGIN',
		description: 'Failed login attempt - invalid password',
		category: 'authentication',
		ipAddress: '192.168.1.103',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T10:05:00'),
		status: 'failed',
		details: {
			reason: 'Invalid password'
		}
	},
	{
		id: '8',
		userId: '4',
		userName: 'Carlos Rodriguez',
		userRole: 'cashier',
		action: 'LOGIN',
		description: 'User logged in successfully',
		category: 'authentication',
		ipAddress: '192.168.1.103',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T10:07:00'),
		status: 'success'
	},
	{
		id: '9',
		userId: '2',
		userName: 'John Dela Cruz',
		userRole: 'cashier',
		action: 'CREATE_ORDER',
		description: 'Created new order #ORD-002',
		category: 'order',
		ipAddress: '192.168.1.101',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T10:30:00'),
		status: 'success',
		details: {
			orderId: 'ORD-002',
			amount: 225.00
		}
	},
	{
		id: '10',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'UPDATE_MENU',
		description: 'Updated menu item: Cappuccino price from ₱120 to ₱130',
		category: 'system',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T11:00:00'),
		status: 'success',
		details: {
			itemId: 'MENU-001',
			previousValue: '₱120',
			newValue: '₱130'
		}
	},
	{
		id: '11',
		userId: '3',
		userName: 'Ana Garcia',
		userRole: 'barista',
		action: 'PROCESS_ORDER',
		description: 'Processed order #ORD-002',
		category: 'order',
		ipAddress: '192.168.1.102',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T11:15:00'),
		status: 'success',
		details: {
			orderId: 'ORD-002'
		}
	},
	{
		id: '12',
		userId: '4',
		userName: 'Carlos Rodriguez',
		userRole: 'cashier',
		action: 'PROCESS_PAYMENT',
		description: 'Processed payment for order #ORD-002',
		category: 'sales',
		ipAddress: '192.168.1.103',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T11:20:00'),
		status: 'success',
		details: {
			orderId: 'ORD-002',
			amount: 225.00
		}
	},
	{
		id: '13',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'VIEW_REPORTS',
		description: 'Generated sales report for today',
		category: 'system',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T12:00:00'),
		status: 'success'
	},
	{
		id: '14',
		userId: '2',
		userName: 'John Dela Cruz',
		userRole: 'cashier',
		action: 'CANCEL_ORDER',
		description: 'Cancelled order #ORD-003 - customer request',
		category: 'order',
		ipAddress: '192.168.1.101',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T12:30:00'),
		status: 'warning',
		details: {
			orderId: 'ORD-003',
			reason: 'Customer request'
		}
	},
	{
		id: '15',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'UPDATE_USER',
		description: 'Updated user permissions for Ana Garcia',
		category: 'user_management',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T13:00:00'),
		status: 'success',
		details: {
			previousValue: 'Basic barista permissions',
			newValue: 'Extended barista permissions'
		}
	},
	{
		id: '16',
		userId: '5',
		userName: 'Lisa Martinez',
		userRole: 'barista',
		action: 'LOGIN',
		description: 'Failed login attempt - account inactive',
		category: 'authentication',
		ipAddress: '192.168.1.104',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T13:15:00'),
		status: 'failed',
		details: {
			reason: 'Account inactive'
		}
	},
	{
		id: '17',
		userId: '1',
		userName: 'Maria Santos',
		userRole: 'admin',
		action: 'UPDATE_INVENTORY',
		description: 'Low stock alert for milk - 5L remaining',
		category: 'inventory',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T14:00:00'),
		status: 'warning',
		details: {
			itemId: 'MILK-001',
			previousValue: '10L',
			newValue: '5L'
		}
	},
	{
		id: '18',
		userId: '6',
		userName: 'Michael Tan',
		userRole: 'admin',
		action: 'LOGIN',
		description: 'User logged in successfully',
		category: 'authentication',
		ipAddress: '192.168.1.105',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T14:30:00'),
		status: 'success'
	},
	{
		id: '19',
		userId: '6',
		userName: 'Michael Tan',
		userRole: 'admin',
		action: 'BACKUP_SYSTEM',
		description: 'Initiated system backup',
		category: 'system',
		ipAddress: '192.168.1.105',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T15:00:00'),
		status: 'success'
	},
	{
		id: '20',
		userId: '2',
		userName: 'John Dela Cruz',
		userRole: 'cashier',
		action: 'LOGOUT',
		description: 'User logged out',
		category: 'authentication',
		ipAddress: '192.168.1.101',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		timestamp: new Date('2025-01-14T16:00:00'),
		status: 'success'
	}
];

export const getLogCategoryInfo = (category: string) => {
	return logCategories.find(c => c.value === category) || logCategories[0];
};

export const getLogStatusInfo = (status: string) => {
	return logStatuses.find(s => s.value === status) || logStatuses[0];
};

