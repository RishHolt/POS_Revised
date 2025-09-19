import React, { useState, useMemo } from "react";
import MenuModal from "../components/modals/MenuModal"; // Assuming MenuModal accepts an onAddToOrder prop
import { Star, Trash2, ShoppingCart, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import { menuData, Category } from "../mocks/menuData";
import { addonData } from "../mocks/addonData";
import type { MenuItem, OrderItem } from "../mocks/menuData"; // type-only import for MenuItem and OrderItem
import SearchAndFilters from "../components/ui/SearchAndFilters";
import PageHeader from "../components/ui/PageHeader";
import Payment from "./Payment";

// OrderItem is now imported from menuData.ts


const POS: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    
    // --- NEW: State for managing the current order ---
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    // --- NEW: State for user feedback animation ---
    const [justAddedId, setJustAddedId] = useState<string | null>(null);
    // --- NEW: State for payment flow ---
    const [showPayment, setShowPayment] = useState(false);
    // --- NEW: State for mobile order toggle ---
    const [isOrderExpanded, setIsOrderExpanded] = useState(false);


    const filteredMenu = menuData.filter(item => {
        const matchesFilter = activeFilter === "all" || item.type === activeFilter;
        const matchesSearch = searchTerm.trim() === "" || (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesFilter && matchesSearch;
    });

    // --- NEW: Calculate total price dynamically ---
    const orderTotal = useMemo(() => {
        // Calculate total including size and add-ons
        return orderItems.reduce((total, item) => {
            const basePrice = item.selectedSize === 'small' ? item.small_price : item.selectedSize === 'large' ? item.large_price : item.medium_price;
        const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
            const addon = addonData.find(a => a.name === addonName && a.available);
            return sum + (addon ? addon.price : 0);
        }, 0) : 0;
            return total + ((basePrice ?? 0) + addonsTotal) * item.quantity;
        }, 0);
    }, [orderItems]);

    // Format price as decimal string - matching Menu.tsx format
    const formatPrice = (price: number | undefined) => price ? `₱${price}` : "N/A";

    const handleMenuClick = (item: MenuItem) => {
        // --- NEW: Prevent opening modal for unavailable items ---
        if (item.status !== 'available') return;

        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    // --- NEW: Function to add/update items in the order ---
    const handleAddToOrder = (itemToAdd: MenuItem, quantity: number, selectedSize: string = "medium", selectedAddons: string[] = []) => {
        setOrderItems(prevItems => {
            // Find an existing item with the same menu_id, size, and addons
            const existingItem = prevItems.find(item =>
                item.menu_id === itemToAdd.menu_id &&
                item.selectedSize === selectedSize &&
                JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons)
            );
            if (existingItem) {
                // If item already exists, update its quantity
                return prevItems.map(item =>
                    item.menu_id === itemToAdd.menu_id &&
                    item.selectedSize === selectedSize &&
                    JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Otherwise, add as a new item
                return [...prevItems, {
                    ...itemToAdd,
                    quantity,
                    orderId: Date.now().toString(),
                    selectedSize,
                    selectedAddons,
                }];
            }
        });
        setJustAddedId(itemToAdd.menu_id);
        setTimeout(() => setJustAddedId(null), 500);
        // Auto-expand order on mobile when items are added
        setIsOrderExpanded(true);
        handleCloseModal();
    };
    
    // --- NEW: Functions to manage the cart ---
    const handleRemoveFromOrder = (orderId: string) => {
        setOrderItems(prev => prev.filter(item => item.orderId !== orderId));
    };

    const handleResetOrder = () => {
        setOrderItems([]);
    };

    // --- NEW: Payment flow handlers ---
    const handleProceedToPayment = () => {
        if (orderItems.length === 0) {
            alert("Please add items to the order before proceeding to payment");
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentComplete = (paymentData: any) => {
        console.log("Payment completed:", paymentData);
        // Here you would typically:
        // 1. Save the order to your backend
        // 2. Print receipt
        // 3. Reset the order
        // 4. Show success message
        
        // For now, just reset and go back to POS
        setOrderItems([]);
        setShowPayment(false);
        alert(`Payment successful! Order ${paymentData.orderId} completed.`);
    };

    const handleBackFromPayment = () => {
        setShowPayment(false);
    };


    // Show payment page if payment flow is active
    if (showPayment) {
        return (
            <Payment
                orderItems={orderItems}
                onBack={handleBackFromPayment}
                onPaymentComplete={handlePaymentComplete}
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row bg-[#F3EEEA] w-full h-full overflow-hidden">
            
            {/* Left: Cafe Menu */}
            <div className={`flex flex-col flex-1 p-3 sm:p-4 lg:p-8 min-h-0 overflow-hidden custom-scrollbar ${isOrderExpanded ? 'lg:flex-1' : 'flex-1'}`}>
                <PageHeader
                    title="Point of Sale"
                    description="Process orders and manage your coffee shop transactions"
                />

                {/* Category buttons - responsive filter buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {Category.map(c => (
                        <button
                            key={c.value}
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-normal transition-colors duration-150 text-sm sm:text-base whitespace-nowrap ${
                                activeFilter === c.value 
                                    ? "bg-[#776B5D] text-[#F3EEEA] shadow-sm" 
                                    : "bg-white text-[#776B5D] hover:bg-[#B0A695]/10 border border-[#B0A695]/20"
                            }`}
                            onClick={() => setActiveFilter(c.value)}
                        >
                            {React.createElement(c.icon, { 
                                className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", 
                                color: activeFilter === c.value ? "#F3EEEA" : "#776B5D" 
                            })}
                            <span className="hidden sm:inline">{c.label}</span>
                            <span className="sm:hidden">{c.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                <SearchAndFilters
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusTags={
                        <>
                            <span className="flex items-center gap-1 bg-orange-100 px-3 py-2 border border-orange-300 rounded-lg font-medium text-orange-600">
                                <Star className="w-4 h-4" /> Best Seller
                            </span>
                            <span className="bg-white px-3 py-2 border border-green-500 rounded-lg font-medium text-green-600">Available</span>
                            <span className="bg-white px-3 py-2 border border-red-500 rounded-lg font-medium text-red-500">Unavailable</span>
                        </>
                    }
                />

                {/* Menu cards grid - matching Menu.tsx card structure exactly */}
                <div className="flex pr-2 sm:pr-4 h-full custom-scrollbar overflow-y-scroll">
                    <div className="gap-3 sm:gap-4 lg:gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
                        {filteredMenu.map(item => (
                            <div
                                key={item.menu_id}
                                className={`flex flex-col items-start bg-white p-4 border rounded-xl transition duration-300 cursor-pointer hover:shadow-xl group border-[#B0A695] ${item.status === 'available' ? 'hover:border-[#776B5D]' : 'opacity-50 grayscale'} ${justAddedId === item.menu_id ? 'border-green-500 shadow-xl' : ''}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                <div className="relative w-full">
                                    <img src={item.image} alt={item.name} className="mb-2 sm:mb-3 rounded-lg w-full object-cover aspect-square" />
                                </div>
                                <div className="mb-2 sm:mb-4 w-full font-bold text-[#776B5D] text-base sm:text-xl truncate">{item.name}</div>
                                <div className={`mb-2 text-xs sm:text-sm capitalize font-medium ${item.type === 'hot' ? 'text-red-500' : item.type === 'cold' ? 'text-blue-500' : 'text-[#776B5D]/70'}`}>{item.type.replace('-', ' ')}</div>
                                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 font-medium text-xs sm:text-sm">
                                    {item.small_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">S {formatPrice(item.small_price)}</span>)}
                                    {item.medium_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">M {formatPrice(item.medium_price)}</span>)}
                                    {item.large_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">L {formatPrice(item.large_price)}</span>)}
                                </div>
                                <div className="flex justify-between mt-auto w-full">
                                    <div className={`font-medium text-sm ${item.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Toggle Button - Only visible on mobile */}
            <div className="lg:hidden flex justify-center p-3 bg-white border-t border-[#B0A695] shadow-lg">
                <button
                    onClick={() => setIsOrderExpanded(!isOrderExpanded)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#776B5D] text-white rounded-xl font-medium transition-all duration-200 hover:bg-[#776B5D]/90 shadow-md hover:shadow-lg"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-base">Current Order ({orderItems.length})</span>
                    {isOrderExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>
            </div>

            {/* Right: Current Order - FIXED LAYOUT */}
            <div className={`flex flex-col bg-white shadow-lg border-[#B0A695] border-t lg:border-t-0 lg:border-l w-full lg:w-[400px] ${isOrderExpanded ? 'h-2/3' : 'h-0'} md:h-full transition-all duration-300 ease-in-out overflow-hidden`}>
                {/* Header */}
                <div className="flex flex-shrink-0 justify-between items-center p-4 sm:p-6 pb-3 sm:pb-4">
                    <h2 className="font-bold text-[#776B5D] text-lg sm:text-xl">Current Order</h2>
                    <button onClick={handleResetOrder} className="bg-[#B0A695]/20 hover:bg-red-100 px-2 sm:px-3 py-1 rounded-lg font-medium text-[#776B5D] hover:text-red-600 transition text-sm">Reset</button>
                </div>
                <hr className="flex-shrink-0 mx-4 sm:mx-6 border-[#B0A695]" />
                
                {/* Order List - Scrollable Content with proper height calculation */}
                <div className="flex flex-col px-4 sm:px-6 py-3 sm:py-4 h-full overflow-y-auto custom-scrollbar">
                    {orderItems.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col justify-center items-center w-full h-full text-[#776B5D]/60 text-center">
                            <ShoppingCart className="mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                            <h3 className="font-bold text-base sm:text-lg">Your cart is empty</h3>
                            <p className="text-xs sm:text-sm">Click on a menu item to get started.</p>
                        </div>
                    ) : (
                        orderItems.map(item => {
                            // Calculate item total
                            const basePrice = item.selectedSize === 'small' ? item.small_price : 
                                            item.selectedSize === 'large' ? item.large_price : 
                                            item.medium_price;
                            const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
                                const addon = addonData.find(a => a.name === addonName && a.available);
                                return sum + (addon ? addon.price : 0);
                            }, 0) : 0;
                            const itemTotal = ((basePrice ?? 0) + addonsTotal) * item.quantity;

                            return (
                                <div key={item.orderId} className="flex bg-[#F3EEEA] mb-2 sm:mb-3 p-3 sm:p-4 border border-[#B0A695] rounded-2xl w-full h-fit">
                                    <img src={item.image} alt={item.name} className="flex-shrink-0 mr-3 sm:mr-4 rounded-lg w-12 h-12 sm:w-16 sm:h-16 object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-2">
                                            <div className="overflow-hidden font-bold text-[#776B5D] text-sm sm:text-lg text-ellipsis whitespace-nowrap">{item.name}</div>
                                            <div className="text-[#776B5D] text-xs sm:text-sm capitalize">{item.type.replace('-', ' ')}</div>
                                            <div className="text-[#776B5D] text-xs sm:text-sm">Size: {item.selectedSize ? item.selectedSize.charAt(0).toUpperCase() + item.selectedSize.slice(1) : 'Medium'}</div>
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="flex flex-col gap-1 mt-2">
                                                    {item.selectedAddons.map(addonName => {
                                                        const addon = addonData.find(a => a.name === addonName && a.available);
                                                        return (
                                                            <div key={addonName} className="flex justify-between items-center font-medium text-[#776B5D] text-xs">
                                                                <span className="truncate">{addonName}</span>
                                                                <span className="ml-2 font-bold text-nowrap">+{formatPrice(addon ? addon.price : 0)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[#776B5D] text-xs sm:text-sm">{item.quantity}x</div>
                                            <div className="font-bold text-[#776B5D] text-sm sm:text-lg">{formatPrice(itemTotal)}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end ml-3">
                                        <button 
                                            onClick={() => handleRemoveFromOrder(item.orderId)} 
                                            className="hover:bg-red-50 p-2 rounded-full text-red-400 hover:text-red-600 transition-colors" 
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* Sticky Footer - Checkout Section - FIXED */}
                {orderItems.length > 0 && (
                    <div className="flex flex-col bg-white p-3 sm:p-4 lg:p-6 border-[#B0A695]/20 border-t w-full h-fit">
                        <div className="flex justify-between mb-2 text-[#776B5D] text-sm">
                            <span>Discount</span>
                            <span>N/A</span>
                        </div>
                        <div className="flex justify-between mb-3 sm:mb-4 font-bold text-[#776B5D] text-base sm:text-lg">
                            <span>Total</span>
                            <span>{formatPrice(orderTotal)}</span>
                        </div>
                        <button 
                            onClick={handleProceedToPayment}
                            className="bg-[#776B5D] hover:bg-[#776B5D]/90 py-2 sm:py-3 rounded-lg w-full font-bold text-[#F3EEEA] text-sm sm:text-lg transition-colors duration-150 flex items-center justify-center"
                        >
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            <span className="hidden sm:inline">Proceed to Payment - {formatPrice(orderTotal)}</span>
                            <span className="sm:hidden">Pay {formatPrice(orderTotal)}</span>
                        </button>
                    </div>
                )}
            </div>
            
            {/* Menu Modal */}
            {selectedItem && (
                <MenuModal
                    item={selectedItem}
                    open={modalOpen}
                    onAddToOrder={(item, quantity, selectedSize, selectedAddons) => {
                        handleAddToOrder(item, quantity, selectedSize, selectedAddons);
                        handleCloseModal();
                    }}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default POS;