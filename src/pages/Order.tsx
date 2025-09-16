import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { salesData } from "../mocks/salesData";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableContainer } from "../components/ui/Table";
import { CheckCircle2, ArrowLeft, Printer, XCircle, Eye, Clock } from "lucide-react";
import { showConfirm, showSuccess } from "../utils/swal";

// Formats numeric amounts into Philippine Peso currency strings for display
const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;

// Order page component
// - List view at /Order shows recent orders with Confirm/Cancel actions
// - Detail view at /Order/:id shows a single order with summary and actions
const Order: React.FC = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Local mock state seeded from salesData and sorted by recency
  const [orders, setOrders] = useState(() =>
    [...salesData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  );
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'cancelled'>('pending');

  const orderIdFromQuery = params.get("orderId");
  // Derives the currently selected order for the detail view (by id or orderId)
  const sale = useMemo(() => orders.find(s => s.id === id || s.orderId === orderIdFromQuery), [orders, id, orderIdFromQuery]);

  // Confirms an order: asks for confirmation, then marks status as 'completed'
  const handleConfirmOrder = async (targetId: string) => {
    const ok = await showConfirm("Confirm Order", "Mark this order as completed?");
    if (!ok) return;
    setOrders(prev => prev.map(o => o.id === targetId ? { ...o, status: 'completed' } : o));
    showSuccess("Order confirmed", "The order has been marked as completed.");
  };

  // Cancels an order: asks for confirmation, then marks status as 'cancelled'
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

  if (!id) {
    const pendingCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
    const filteredOrders = orders.filter(order => {
      if (statusFilter === 'pending') {
        return order.status !== 'completed' && order.status !== 'cancelled';
      }
      return order.status === statusFilter;
    });
    const hasAny = filteredOrders.length > 0;

    return (
      <div className="bg-[#F3EEEA] p-8 h-full overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-[#776B5D] text-2xl lg:text-3xl">Recent Orders</h1>
              <p className="text-[#776B5D]/70 mt-1">Review pending and completed orders. Confirm to complete or cancel if needed.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
          {([
            { key: 'pending', label: 'Pending', Icon: Clock, count: pendingCount },
            { key: 'completed', label: 'Completed', Icon: CheckCircle2, count: completedCount },
            { key: 'cancelled', label: 'Cancelled', Icon: XCircle, count: cancelledCount }
          ] as const).map(({ key, label, Icon, count }) => (
            <div key={key} className="flex justify-center items-center bg-white p-2 rounded-xl">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-normal transition-colors duration-150 w-full h-full ${statusFilter === (key as any) ? "bg-[#776B5D] text-[#F3EEEA]" : "bg-transparent text-[#776B5D]"}`}
                onClick={() => setStatusFilter(key as any)}
              >
                <Icon className="w-5 h-5" color={statusFilter === (key as any) ? "#F3EEEA" : "#776B5D"} />
                <span className="capitalize">{label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusFilter === (key as any) ? 'bg-[#F3EEEA] text-[#776B5D]' : 'bg-[#B0A695]/20 text-[#776B5D]'}`}>{count}</span>
              </button>
            </div>
          ))}
        </div>

        <TableContainer scrollable className="max-h-[55vh]">
          <TableHeader sticky>
            <tr>
              <TableCell header>Order ID</TableCell>
              <TableCell header>Customer</TableCell>
              <TableCell header>Items</TableCell>
              <TableCell header>Total</TableCell>
              <TableCell header>Payment</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="underline"><Link to={`/Order/${order.id}`}>{order.orderId}</Link></TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.slice(0, 2).map((i, idx) => (
                      <div key={idx}>{i.quantity}x {i.name}</div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-[#776B5D]/70">+{order.items.length - 2} more</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                <TableCell>{order.paymentMethod === 'gcash' ? 'GCash' : 'Cash'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-[#B0A695]/20 text-[#776B5D]'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/Order/${order.id}`)}>View</Button>
                    <Button size="sm" icon={CheckCircle2} onClick={() => handleConfirmOrder(order.id)} disabled={order.status === 'completed' || order.status === 'cancelled'}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="secondary" icon={XCircle} onClick={() => handleCancelOrder(order.id)} disabled={order.status === 'cancelled' || order.status === 'completed'}>
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>

        {/* Empty state */}
        {hasAny ? null : (
          <div className="flex flex-col justify-center items-center bg-white mt-4 p-8 border border-dashed border-[#B0A695] rounded-xl text-center">
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
              <p className="text-[#776B5D]/70 mt-1">We couldn't find the order you were looking for.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3EEEA] p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <h1 className="font-bold text-[#776B5D] text-2xl lg:text-3xl">{`Order ${sale.orderId}`}</h1>
            <p className="text-[#776B5D]/70 mt-1">{`Customer: ${sale.customerName} • ${new Date(sale.timestamp).toLocaleString()}`}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Table>
            <TableHeader>
              <tr>
                <TableCell header>Item</TableCell>
                <TableCell header>Size</TableCell>
                <TableCell header>Qty</TableCell>
                <TableCell header>Unit Price</TableCell>
                <TableCell header>Total</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {sale.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    {item.addons && item.addons.length > 0 && (
                      <div className="text-[#776B5D]/70 text-sm">Addons: {item.addons.join(", ")}</div>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white shadow-sm p-6 rounded-xl">
            <h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Summary</h3>
            <div className="space-y-2 text-[#776B5D]">
              <div className="flex justify-between"><span>Items Subtotal</span><span>{formatCurrency(itemsTotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <hr className="my-3 border-[#B0A695]/40" />
              <div className="flex justify-between font-bold text-lg"><span>Grand Total</span><span>{formatCurrency(grandTotal)}</span></div>
              <div className="flex justify-between"><span>Payment Method</span><span className="font-medium capitalize">{sale.paymentMethod === 'gcash' ? 'GCash' : 'Cash'}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="font-medium capitalize">{sale.status}</span></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleConfirmOrder(sale.id)} icon={CheckCircle2} disabled={sale.status === 'completed' || sale.status === 'cancelled'}>
              Confirm Order
            </Button>
            <Button onClick={() => handleCancelOrder(sale.id)} variant="secondary" icon={XCircle} disabled={sale.status === 'cancelled' || sale.status === 'completed'}>
              Cancel Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;


