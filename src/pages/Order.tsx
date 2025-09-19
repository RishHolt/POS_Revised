import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { salesData } from "../mocks/salesData";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableContainer } from "../components/ui/Table";
import { CheckCircle2, ArrowLeft, Printer, XCircle, Eye, Clock } from "lucide-react";
import { showConfirm, showSuccess } from "../utils/swal";

const formatCurrency = (amount: number) => `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Order: React.FC = () => {
    const { id } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [orders, setOrders] = useState(() =>
        [...salesData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
    const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'cancelled'>('pending');

    const orderIdFromQuery = params.get("orderId");
    const sale = useMemo(() => orders.find(s => s.id === id || s.orderId === orderIdFromQuery), [orders, id, orderIdFromQuery]);

    const handleConfirmOrder = async (targetId: string) => {
        const ok = await showConfirm("Confirm Order", "Mark this order as completed?");
        if (!ok) return;
        setOrders(prev => prev.map(o => o.id === targetId ? { ...o, status: 'completed' } : o));
        showSuccess("Order confirmed", "The order has been marked as completed.");
    };

    const handleCancelOrder = async (targetId: string) => {
        const ok = await showConfirm("Cancel Order", "Are you sure you want to cancel this order?");
        if (!ok) return;
        setOrders(prev => prev.map(o => o.id === targetId ? { ...o, status: 'cancelled' } : o));
        showSuccess("Order cancelled", "The order has been cancelled.");
    };

    const itemsTotal = sale ? sale.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) : 0;
    const discount = sale ? (sale.discount ?? 0) : 0;
    const tax = sale ? (sale.tax ?? 0) : 0;
    const grandTotal = sale ? sale.total : 0;

    // --- RENDER ORDER LIST VIEW ---
    if (!id) {
        const pendingCount = orders.filter(o => o.status === 'pending').length;
        const completedCount = orders.filter(o => o.status === 'completed').length;
        const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
        const filteredOrders = orders.filter(order => order.status === statusFilter);
        const hasAny = filteredOrders.length > 0;

        return (
            <div className="bg-[#F3EEEA] p-4 sm:p-6 lg:p-8 h-full overflow-y-auto custom-scrollbar">
                <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="font-bold text-[#776B5D] text-2xl lg:text-3xl">Recent Orders</h1>
                        <p className="mt-1 text-[#776B5D]/70">Review, confirm, or cancel orders.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto" variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {([
                        { key: 'pending', label: 'Pending', Icon: Clock, count: pendingCount },
                        { key: 'completed', label: 'Completed', Icon: CheckCircle2, count: completedCount },
                        { key: 'cancelled', label: 'Cancelled', Icon: XCircle, count: cancelledCount }
                    ] as const).map(({ key, label, Icon, count }) => (
                        <button
                            key={key}
                            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 sm:flex-none sm:px-4 ${statusFilter === key ? "bg-[#776B5D] text-[#F3EEEA]" : "bg-white text-[#776B5D] hover:bg-gray-50"}`}
                            onClick={() => setStatusFilter(key)}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="capitalize">{label}</span>
                            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusFilter === key ? 'bg-[#F3EEEA] text-[#776B5D]' : 'bg-[#B0A695]/20 text-[#776B5D]'}`}>{count}</span>
                        </button>
                    ))}
                </div>

                {/* --- RESPONSIVE CONTENT: CARDS FOR MOBILE, TABLE FOR DESKTOP --- */}
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white shadow-sm p-4 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link to={`/Order/${order.id}`} className="font-bold text-[#776B5D] text-lg underline">{order.orderId}</Link>
                                    <p className="text-[#776B5D]/80 text-sm">{order.customerName}</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <hr className="my-3 border-gray-200" />
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[#776B5D]/80 text-sm">Total</p>
                                    <p className="font-bold text-[#776B5D] text-xl">{formatCurrency(order.total)}</p>
                                </div>
                                <div className="flex gap-2">
                                     <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/Order/${order.id}`)}>View</Button>
                                     {order.status === 'pending' && <Button size="sm" icon={CheckCircle2} onClick={() => handleConfirmOrder(order.id)}>Confirm</Button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <TableContainer>
                        <TableHeader sticky>
                            <tr>
                                <TableCell header>Order ID</TableCell>
                                <TableCell header>Customer</TableCell>
                                <TableCell header>Items</TableCell>
                                <TableCell header>Total</TableCell>
                                <TableCell header>Status</TableCell>
                                <TableCell header>Actions</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell><Link to={`/Order/${order.id}`} className="font-semibold text-[#776B5D] underline">{order.orderId}</Link></TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.items.length} item(s)</TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                                    <TableCell>
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>{order.status}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/Order/${order.id}`)}>View</Button>
                                            <Button size="sm" icon={CheckCircle2} onClick={() => handleConfirmOrder(order.id)} disabled={order.status !== 'pending'}>Confirm</Button>
                                            <Button size="sm" variant="danger" icon={XCircle} onClick={() => handleCancelOrder(order.id)} disabled={order.status !== 'pending'}>Cancel</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableContainer>
                </div>

                {!hasAny && (
                    <div className="flex flex-col justify-center items-center bg-white mt-4 p-8 border border-[#B0A695] border-dashed rounded-xl text-center">
                        <div className="font-semibold text-[#776B5D] text-lg">No orders found</div>
                        <div className="text-[#776B5D]/70">Try switching to a different status filter.</div>
                    </div>
                )}
            </div>
        );
    }

    if (!sale) {
        return (
            <div className="bg-[#F3EEEA] p-8 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
                        <div>
                            <h1 className="font-bold text-[#776B5D] text-2xl lg:text-3xl">Order Not Found</h1>
                            <p className="mt-1 text-[#776B5D]/70">We couldn't find the order you were looking for.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER ORDER DETAIL VIEW ---
    return (
        <div className="bg-[#F3EEEA] p-4 sm:p-6 lg:p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
                    <div>
                        <h1 className="font-bold text-[#776B5D] text-2xl lg:text-3xl">{`Order ${sale.orderId}`}</h1>
                        <p className="mt-1 text-[#776B5D]/70 text-sm sm:text-base">{`Customer: ${sale.customerName} • ${new Date(sale.timestamp).toLocaleString()}`}</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button className="w-full sm:w-auto" variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
                </div>
            </div>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-white shadow-sm rounded-xl overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell header>Item</TableCell>
                                <TableCell header className="text-right">Total</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {sale.items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <div className="font-medium">{item.name} <span className="text-gray-500">x{item.quantity}</span></div>
                                        <div className="text-[#776B5D]/70 text-sm capitalize">{item.size}{item.addons && item.addons.length > 0 && `, ${item.addons.join(", ")}`}</div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-right">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white shadow-sm p-6 rounded-xl">
                        <h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Summary</h3>
                        <div className="space-y-2 text-[#776B5D]">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(itemsTotal)}</span></div>
                            <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
                            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
                            <hr className="my-3 border-[#B0A695]/40" />
                            <div className="flex justify-between font-bold text-lg"><span>Grand Total</span><span>{formatCurrency(grandTotal)}</span></div>
                        </div>
                    </div>
                    {sale.status === 'pending' && (
                        <div className="flex sm:flex-row flex-col gap-2">
                            <Button className="flex-1" onClick={() => handleConfirmOrder(sale.id)} icon={CheckCircle2}>Confirm</Button>
                            <Button className="flex-1" onClick={() => handleCancelOrder(sale.id)} variant="danger" icon={XCircle}>Cancel</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;