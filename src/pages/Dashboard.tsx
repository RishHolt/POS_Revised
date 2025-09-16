import React, { useMemo } from "react";
import { 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	ResponsiveContainer,
	Area,
	AreaChart
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { salesData } from "../mocks/salesData";
import { ingredientsList } from "../mocks/ingredientsData";
import { 
	TrendingUp, 
	ShoppingCart, 
	AlertTriangle, 
	DollarSign,
	CheckCircle,
	RefreshCw,
	Star
} from "lucide-react";
import { format } from "date-fns";

// Analytics types
type SaleItem = {
	name: string;
	quantity: number;
	unitPrice: number;
};

type Sale = {
	id: string;
	orderId: string;
	customerName: string;
	items: SaleItem[];
	total: number;
	paymentMethod: 'cash' | 'gcash';
	status: 'completed' | 'refunded' | 'cancelled';
	timestamp: Date;
};

type TopSellingItem = {
	name: string;
	quantity: number;
	revenue: number;
};

type RevenueByDay = {
	date: string;
	revenue: number;
	orders: number;
};

type PaymentMethodBreakdown = {
	method: string;
	count: number;
	revenue: number;
	percentage: number;
};

type Analytics = {
	totalRevenue: number;
	totalOrders: number;
	averageOrderValue: number;
	topSellingItems: TopSellingItem[];
	revenueByDay: RevenueByDay[];
	paymentMethodBreakdown: PaymentMethodBreakdown[];
};

// Generate analytics data
function generateAnalytics(sales: Sale[]): Analytics {
	const completedSales = sales.filter((sale: Sale) => sale.status === 'completed');
	const totalRevenue = completedSales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);
	const totalOrders = completedSales.length;
	const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	// Top selling items
	const itemCounts = new Map<string, TopSellingItem>();
	completedSales.forEach((sale: Sale) => {
		sale.items.forEach((item: SaleItem) => {
			const key = item.name;
			if (itemCounts.has(key)) {
				const existing = itemCounts.get(key)!;
				existing.quantity += item.quantity;
				existing.revenue += item.unitPrice * item.quantity;
			} else {
				itemCounts.set(key, {
					name: item.name,
					quantity: item.quantity,
					revenue: item.unitPrice * item.quantity
				});
			}
		});
	});
	const topSellingItems = Array.from(itemCounts.values())
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 5);

	// Revenue by day (last 7 days)
	const revenueByDay: RevenueByDay[] = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - i));
		const daySales = completedSales.filter((sale: Sale) =>
			sale.timestamp.toDateString() === date.toDateString()
		);
		return {
			date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
			revenue: daySales.reduce((sum: number, sale: Sale) => sum + sale.total, 0),
			orders: daySales.length
		};
	});

	// Payment method breakdown
	const paymentMethods: Array<'cash' | 'gcash'> = ['cash', 'gcash'];
	const paymentMethodBreakdown: PaymentMethodBreakdown[] = paymentMethods.map((method) => {
		const methodSales = completedSales.filter((sale: Sale) => sale.paymentMethod === method);
		const revenue = methodSales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);
		return {
			method: method.charAt(0).toUpperCase() + method.slice(1),
			count: methodSales.length,
			revenue,
			percentage: totalOrders > 0 ? (methodSales.length / totalOrders) * 100 : 0
		};
	});

	return {
		totalRevenue,
		totalOrders,
		averageOrderValue,
		topSellingItems,
		revenueByDay,
		paymentMethodBreakdown
	};
}

const Dashboard: React.FC = () => {
	// Generate analytics for today's data
	const today = new Date();
	const todaySales = salesData.filter(sale => 
		sale.timestamp.toDateString() === today.toDateString()
	);

	// Fix type mismatch by casting todaySales to Sale[] if needed
	const analytics = useMemo(() => generateAnalytics(todaySales as Sale[]), [todaySales]);

	// Count active users (for future use)
	// const activeUsers = usersData.filter(user => user.status === 'active').length;
	// Check low stock items
	const lowStockItems = ingredientsList.filter(ingredient => 
		ingredient.stock <= ingredient.minStock
	);
	
	// Get recent orders (last 5)
	const recentOrders = salesData
		.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
		.slice(0, 5);

	const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;
	const formatNumber = (num: number) => num.toLocaleString();

	const actions = (
		<>
			<Button icon={RefreshCw}>
				Refresh
			</Button>
		</>
	);
	

	return (
		<div className="bg-[#F3EEEA] p-8 h-full overflow-y-auto custom-scrollbar">
			<PageHeader
				title="Dashboard"
				description="Here's what's happening with your coffee shop today."
				actions={actions}
			/>

			{/* Key Metrics Cards - Consistent with other pages */}
			<div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
				{/* Total Sales */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-start mb-4">
						<div>
							<p className="mb-1 font-medium text-[#776B5D]/70 text-sm">Total Sales</p>
							<p className="font-bold text-[#776B5D] text-3xl">{formatCurrency(analytics.totalRevenue)}</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<DollarSign className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-sm">
							<TrendingUp className="mr-1 w-4 h-4 text-green-500" />
							<span className="font-medium text-green-600">+15.0% from yesterday</span>
						</div>
						<div className="text-[#776B5D]/70 text-sm">
							<span>This week {formatCurrency(analytics.totalRevenue * 0.8)}</span>
						</div>
						<div className="text-[#776B5D]/70 text-sm">
							<span>This month {formatCurrency(analytics.totalRevenue * 1.2)}</span>
						</div>
						<button className="font-medium text-[#776B5D] hover:text-[#776B5D]/80 text-sm">View all sales</button>
					</div>
				</div>

				{/* Total Orders */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-start mb-4">
						<div>
							<p className="mb-1 font-medium text-[#776B5D]/70 text-sm">Total Orders</p>
							<p className="font-bold text-[#776B5D] text-3xl">{formatNumber(analytics.totalOrders)}</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<ShoppingCart className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-sm">
							<TrendingUp className="mr-1 w-4 h-4 text-green-500" />
							<span className="font-medium text-green-600">+15.0% from yesterday</span>
						</div>
						<div className="text-[#776B5D]/70 text-sm">
							<span>This week {Math.round(analytics.totalOrders * 0.8)}</span>
						</div>
						<div className="text-[#776B5D]/70 text-sm">
							<span>This month {Math.round(analytics.totalOrders * 1.2)}</span>
						</div>
						<button className="font-medium text-[#776B5D] hover:text-[#776B5D]/80 text-sm">View all sales</button>
					</div>
				</div>

				{/* Best Seller */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-start mb-4">
						<div>
							<p className="mb-1 font-medium text-[#776B5D]/70 text-sm">Best Seller</p>
							<p className="flex items-center font-bold text-[#776B5D] text-2xl">
								<Star className="mr-2 w-5 h-5 text-yellow-500" />
								{analytics.topSellingItems[0]?.name || 'Cappuccino'}
							</p>
						</div>
						<div className="bg-purple-100 p-3 rounded-full">
							<TrendingUp className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="text-[#776B5D]/70 text-sm">
							<span className="font-medium">17.2%</span>
						</div>
						<div className="flex items-center text-sm">
							<TrendingUp className="mr-1 w-4 h-4 text-green-500" />
							<span className="font-medium text-green-600">+3.2% from yesterday</span>
						</div>
						{analytics.topSellingItems.slice(1, 3).map((item, index) => (
							<div key={item.name} className="text-[#776B5D]/70 text-sm">
								<span>{index + 2}. {item.name} {((item.quantity / analytics.topSellingItems[0]?.quantity) * 100).toFixed(1)}% +5.2%</span>
							</div>
						))}
						<button className="font-medium text-[#776B5D] hover:text-[#776B5D]/80 text-sm">View all sales</button>
					</div>
				</div>

				{/* Low Stock Items */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-start mb-4">
						<div>
							<p className="mb-1 font-medium text-[#776B5D]/70 text-sm">Low Stock Items</p>
							<p className="font-bold text-[#776B5D] text-3xl">{lowStockItems.length}</p>
						</div>
						<div className="bg-orange-100 p-3 rounded-full">
							<AlertTriangle className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center font-medium text-red-600 text-sm">
							<AlertTriangle className="mr-1 w-4 h-4" />
							<span>! Action Required</span>
						</div>
						{lowStockItems.slice(0, 3).map((item) => (
							<div key={item.id} className="text-[#776B5D]/70 text-sm">
								<span>{item.name} {item.stock} / {item.minStock * 2} {item.unit}</span>
							</div>
						))}
						<button className="font-medium text-[#776B5D] hover:text-[#776B5D]/80 text-sm">View all Inventory</button>
					</div>
				</div>
			</div>

			{/* Charts and Recent Sales Section */}
			<div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mb-8">
				{/* Weekly Sales Trend */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-semibold text-[#776B5D] text-lg">Weekly Sales Trend</h3>
					</div>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={analytics.revenueByDay}>
								<CartesianGrid strokeDasharray="3 3" stroke="#B0A695" />
								<XAxis dataKey="date" stroke="#776B5D" />
								<YAxis stroke="#776B5D" />
								<Tooltip 
									contentStyle={{ 
										backgroundColor: '#F3EEEA', 
										border: '1px solid #B0A695',
										borderRadius: '8px'
									}} 
								/>
								<Area 
									type="monotone" 
									dataKey="revenue" 
									stroke="#776B5D" 
									fill="#776B5D" 
									fillOpacity={0.3}
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Selling Items */}
				<div className="bg-white shadow-sm p-6 rounded-xl">
					<h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Top Selling Items Today</h3>
					<div className="space-y-4">
						{analytics.topSellingItems.length === 0 ? (
							<div className="py-8 text-[#776B5D]/70 text-center">No sales data for today.</div>
						) : (
							analytics.topSellingItems.map((item, index) => (
								<div key={item.name} className="flex justify-between items-center">
									<div className="flex items-center">
										<div className="flex justify-center items-center bg-[#776B5D] mr-3 rounded-full w-8 h-8 font-bold text-white text-sm">
											{index + 1}
										</div>
										<div>
											<p className="font-medium text-[#776B5D]">{item.name}</p>
											<p className="text-[#776B5D]/70 text-sm">{item.quantity} sold</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold text-[#776B5D]">{formatCurrency(item.revenue)}</p>
										<p className="text-[#776B5D]/70 text-sm">revenue</p>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Low Stock Alerts - Full width */}
			<div className="bg-white shadow-sm p-6 mb-8 rounded-xl">
				<h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Low Stock Alerts</h3>
				{lowStockItems.length > 0 ? (
					<div className="space-y-3">
						{lowStockItems.map((item) => (
							<div key={item.id} className="flex justify-between items-center bg-orange-50 p-3 border border-orange-200 rounded-lg">
								<div className="flex items-center">
									<AlertTriangle className="mr-3 w-5 h-5 text-orange-500" />
									<div>
										<p className="font-medium text-[#776B5D]">{item.name}</p>
										<p className="text-[#776B5D]/70 text-sm">{item.stock} {item.unit} remaining</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-medium text-orange-600 text-sm">Min: {item.minStock}</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="py-4 text-center">
						<CheckCircle className="mx-auto mb-2 w-12 h-12 text-green-500" />
						<p className="text-[#776B5D]/70">All items are well stocked!</p>
					</div>
				)}
			</div>

			{/* Recent Orders - Card Layout */}
			<div className="bg-white shadow-sm p-6 rounded-xl">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-semibold text-[#776B5D] text-lg">Recent Orders</h3>
					<button className="font-medium text-[#776B5D] hover:text-[#776B5D]/80 text-sm">View All</button>
				</div>
				<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{recentOrders.map((order) => (
						<div key={order.id} className="bg-[#F3EEEA] p-4 border border-[#B0A695]/20 hover:border-[#776B5D]/30 rounded-lg transition-colors">
							<div className="flex justify-between items-start mb-3">
								<div>
									<p className="font-semibold text-[#776B5D] text-sm">Order #{order.orderId}</p>
									<p className="text-[#776B5D]/70 text-xs">{format(order.timestamp, 'MMM dd, HH:mm')}</p>
								</div>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${
									order.status === 'completed' 
										? 'bg-green-100 text-green-700'
										: order.status === 'pending'
										? 'bg-yellow-100 text-yellow-700'
										: 'bg-red-100 text-red-700'
								}`}>
									{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
								</span>
							</div>
							<div className="space-y-2 mb-3">
								<p className="font-medium text-[#776B5D] text-sm">{order.customerName}</p>
								<div className="space-y-1">
									{order.items.slice(0, 2).map((item, index) => (
										<div key={index} className="text-[#776B5D]/70 text-xs">
											{item.quantity}x {item.name}
										</div>
									))}
									{order.items.length > 2 && (
										<div className="text-[#776B5D]/50 text-xs">
											+{order.items.length - 2} more items
										</div>
									)}
								</div>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-[#776B5D]/70 text-xs">
									{order.paymentMethod === 'gcash' ? 'GCash' : 'Cash'}
								</span>
								<span className="font-bold text-[#776B5D]">{formatCurrency(order.total)}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;