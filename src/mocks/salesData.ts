export interface Sale {
	id: string;
	orderId: string;
	customerName: string;
	items: SaleItem[];
	total: number;
	paymentMethod: 'cash' | 'gcash';
	status: 'completed' | 'pending' | 'cancelled';
	timestamp: Date;
	discount?: number;
	tax: number;
}

export interface SaleItem {
	menuId: string;
	name: string;
	quantity: number;
	unitPrice: number;
	size: 'small' | 'medium' | 'large';
	addons: string[];
}

export interface SalesAnalytics {
	totalRevenue: number;
	totalOrders: number;
	averageOrderValue: number;
	topSellingItems: Array<{
		name: string;
		quantity: number;
		revenue: number;
	}>;
	revenueByHour: Array<{
		hour: string;
		revenue: number;
		orders: number;
	}>;
	revenueByDay: Array<{
		date: string;
		revenue: number;
		orders: number;
	}>;
	paymentMethodBreakdown: Array<{
		method: string;
		count: number;
		revenue: number;
		percentage: number;
	}>;
}

// Mock sales data
export const salesData: Sale[] = [
	{
		id: '1',
		orderId: 'ORD-001',
		customerName: 'John Doe',
		items: [
			{
				menuId: '1',
				name: 'Cappuccino',
				quantity: 2,
				unitPrice: 100,
				size: 'small',
				addons: ['Extra Shot']
			},
			{
				menuId: '2',
				name: 'Iced Cappuccino',
				quantity: 1,
				unitPrice: 200,
				size: 'medium',
				addons: ['Vanilla Syrup']
			}
		],
		total: 450,
		paymentMethod: 'gcash',
		status: 'completed',
		timestamp: new Date('2025-09-14T08:30:00'),
		discount: 0,
		tax: 40.5
	},
	{
		id: '2',
		orderId: 'ORD-002',
		customerName: 'Jane Smith',
		items: [
			{
				menuId: '3',
				name: 'Americano',
				quantity: 1,
				unitPrice: 200,
				size: 'medium',
				addons: []
			}
		],
		total: 200,
		paymentMethod: 'cash',
		status: 'cancelled',
		timestamp: new Date('2025-09-13T09:15:00'), // updated date
		discount: 10,
		tax: 18
	},
	{
		id: '3',
		orderId: 'ORD-003',
		customerName: 'Mike Johnson',
		items: [
			{
				menuId: '6',
				name: 'Caramel Frappe',
				quantity: 1,
				unitPrice: 220,
				size: 'medium',
				addons: ['Whipped Cream']
			},
			{
				menuId: '7',
				name: 'Strawberry Soda',
				quantity: 2,
				unitPrice: 180,
				size: 'large',
				addons: []
			}
		],
		total: 620,
		paymentMethod: 'gcash',
		status: 'pending',
		timestamp: new Date('2025-09-12T10:45:00'), // updated date
		discount: 0,
		tax: 55.8
	},
	{
		id: '4',
		orderId: 'ORD-004',
		customerName: 'Sarah Wilson',
		items: [
			{
				menuId: '5',
				name: 'Vanilla Latte',
				quantity: 1,
				unitPrice: 200,
				size: 'medium',
				addons: ['Caramel Syrup', 'Extra Shot']
			}
		],
		total: 250,
		paymentMethod: 'gcash',
		status: 'completed',
		timestamp: new Date('2025-09-11T11:20:00'), // updated date
		discount: 0,
		tax: 22.5
	},
	{
		id: '5',
		orderId: 'ORD-005',
		customerName: 'David Brown',
		items: [
			{
				menuId: '8',
				name: 'Matcha Milk Tea',
				quantity: 1,
				unitPrice: 210,
				size: 'medium',
				addons: []
			}
		],
		total: 210,
		paymentMethod: 'cash',
		status: 'pending',
		timestamp: new Date('2025-09-10T12:00:00'), // updated date
		discount: 0,
		tax: 18.9
	},
	{
		id: '6',
		orderId: 'ORD-006',
		customerName: 'Lisa Garcia',
		items: [
			{
				menuId: '1',
				name: 'Cappuccino',
				quantity: 3,
				unitPrice: 100,
				size: 'small',
				addons: []
			},
			{
				menuId: '3',
				name: 'Americano',
				quantity: 2,
				unitPrice: 200,
				size: 'medium',
				addons: []
			}
		],
		total: 700,
		paymentMethod: 'gcash',
		status: 'pending',
		timestamp: new Date('2025-09-09T13:30:00'), // updated date
		discount: 50,
		tax: 58.5
	},
	{
		id: '7',
		orderId: 'ORD-007',
		customerName: 'Tom Anderson',
		items: [
			{
				menuId: '9',
				name: 'Hazelnut Frappe',
				quantity: 1,
				unitPrice: 230,
				size: 'medium',
				addons: ['Chocolate Sauce']
			}
		],
		total: 250,
		paymentMethod: 'gcash',
		status: 'pending',
		timestamp: new Date('2025-09-08T14:15:00'), // updated date
		discount: 0,
		tax: 22.5
	},
	{
		id: '8',
		orderId: 'ORD-008',
		customerName: 'Emma Davis',
		items: [
			{
				menuId: '10',
				name: 'Classic Soda',
				quantity: 2,
				unitPrice: 160,
				size: 'large',
				addons: []
			}
		],
		total: 320,
		paymentMethod: 'cash',
		status: 'completed',
		timestamp: new Date('2025-09-07T15:00:00'), // updated date
		discount: 0,
		tax: 28.8
	}
];


