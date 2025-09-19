import React, { useState, useMemo } from "react";
import MenuModal from "../components/modals/MenuModal"; 
import { Star, Trash2, ShoppingCart, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import { menuData, Category } from "../mocks/menuData";
import { addonData } from "../mocks/addonData";
import type { MenuItem, OrderItem } from "../mocks/menuData"; 
import SearchAndFilters from "../components/ui/SearchAndFilters";
import PageHeader from "../components/ui/PageHeader";
import Payment from "./Payment";


const POS: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [justAddedId, setJustAddedId] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
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

    const orderTotal = useMemo(() => {
        return orderItems.reduce((total, item) => {
            const basePrice = item.selectedSize === 'small' ? item.small_price : item.selectedSize === 'large' ? item.large_price : item.medium_price;
            const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
                const addon = addonData.find(a => a.name === addonName && a.available);
                return sum + (addon ? addon.price : 0);
            }, 0) : 0;
            return total + ((basePrice ?? 0) + addonsTotal) * item.quantity;
        }, 0);
    }, [orderItems]);

    const formatPrice = (price: number | undefined) => price ? `₱${price.toFixed(2)}` : "N/A";

    const handleMenuClick = (item: MenuItem) => {
        if (item.status !== 'available') return;
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleAddToOrder = (itemToAdd: MenuItem, quantity: number, selectedSize: string = "medium", selectedAddons: string[] = []) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.menu_id === itemToAdd.menu_id &&
                item.selectedSize === selectedSize &&
                JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons)
            );
            if (existingItem) {
                return prevItems.map(item =>
                    item.menu_id === itemToAdd.menu_id &&
                    item.selectedSize === selectedSize &&
                    JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
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
        handleCloseModal();
    };
    
    const handleRemoveFromOrder = (orderId: string) => {
        setOrderItems(prev => prev.filter(item => item.orderId !== orderId));
    };

    const handleResetOrder = () => {
        setOrderItems([]);
    };

    const handleProceedToPayment = () => {
        if (orderItems.length === 0) {
            alert("Please add items to the order before proceeding to payment");
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentComplete = (paymentData: any) => {
        console.log("Payment completed:", paymentData);
        setOrderItems([]);
        setShowPayment(false);
        alert(`Payment successful! Order ${paymentData.orderId} completed.`);
    };

    const handleBackFromPayment = () => {
        setShowPayment(false);
    };

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
        <div className="flex lg:flex-row flex-col bg-[#F3EEEA] w-full h-full">
            {/* Left: Cafe Menu */}
            <div className={`flex flex-1 flex-col p-3 min-h-0 sm:p-4 lg:p-8 ${isOrderExpanded ? 'lg:flex-1' : 'flex-1'}`}>
                <PageHeader
                    title="Point of Sale"
                    description="Process orders and manage your coffee shop transactions"
                />
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {Category.map(c => (
                        <button
                            key={c.value}
                            className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-normal transition-colors duration-150 sm:gap-2 sm:px-4 sm:text-base ${
                                activeFilter === c.value 
                                    ? "bg-[#776B5D] text-[#F3EEEA] shadow-sm" 
                                    : "border border-[#B0A695]/20 bg-white text-[#776B5D] hover:bg-[#B0A695]/10"
                            }`}
                            onClick={() => setActiveFilter(c.value)}
                        >
                            {React.createElement(c.icon, { 
                                className: "w-4 h-4 flex-shrink-0 sm:w-5 sm:h-5", 
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
                <div className="flex-1 pr-2 sm:pr-4 overflow-y-auto custom-scrollbar">
                    <div className="gap-3 sm:gap-4 lg:gap-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] w-full">
                        {filteredMenu.map(item => (
                            <div
                                key={item.menu_id}
                                className={`group flex cursor-pointer flex-col items-start rounded-xl border border-[#B0A695] bg-white p-4 transition duration-300 hover:shadow-xl ${item.status === 'available' ? 'hover:border-[#776B5D]' : 'grayscale opacity-50'} ${justAddedId === item.menu_id ? 'border-green-500 shadow-xl' : ''}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                <div className="relative w-full">
                                    <img src={item.image} alt={item.name} className="mb-2 sm:mb-3 rounded-lg w-full object-cover aspect-square" />
                                </div>
                                <div className="mb-2 sm:mb-4 w-full font-bold text-[#776B5D] text-base sm:text-xl truncate">{item.name}</div>
                                <div className={`mb-2 text-xs font-medium capitalize sm:text-sm ${item.type === 'hot' ? 'text-red-500' : item.type === 'cold' ? 'text-blue-500' : 'text-[#776B5D]/70'}`}>{item.type.replace('-', ' ')}</div>
                                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 font-medium text-xs sm:text-sm">
                                    {item.small_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">S {formatPrice(item.small_price)}</span>)}
                                    {item.medium_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">M {formatPrice(item.medium_price)}</span>)}
                                    {item.large_price && (<span className="bg-[#B0A695]/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[#776B5D]">L {formatPrice(item.large_price)}</span>)}
                                </div>
                                <div className="flex justify-between mt-auto w-full">
                                    <div className={`text-sm font-medium ${item.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden flex justify-center bg-white shadow-lg p-3 border-[#B0A695] border-t">
                <button
                    onClick={() => setIsOrderExpanded(!isOrderExpanded)}
                    className="flex items-center gap-2 bg-[#776B5D] hover:bg-[#776B5D]/90 shadow-md hover:shadow-lg px-6 py-3 rounded-xl font-medium text-white transition-all duration-200"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-base">Current Order ({orderItems.length})</span>
                    {isOrderExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>
            </div>

            {/* Right: Current Order */}
            <div className={`flex flex-col border-t border-[#B0A695] bg-white shadow-lg transition-all duration-300 ease-in-out lg:w-[400px] lg:flex-shrink-0 lg:border-t-0 lg:border-l ${isOrderExpanded ? 'h-2/3' : 'h-0'} lg:h-full overflow-hidden`}>
                <div className="flex flex-shrink-0 justify-between items-center p-4 sm:p-6 pb-3 sm:pb-4">
                    <h2 className="font-bold text-[#776B5D] text-lg sm:text-xl">Current Order</h2>
                    <button onClick={handleResetOrder} className="bg-[#B0A695]/20 hover:bg-red-100 px-2 sm:px-3 py-1 rounded-lg font-medium text-[#776B5D] hover:text-red-600 text-sm transition">Reset</button>
                </div>
                <hr className="flex-shrink-0 mx-4 sm:mx-6 border-[#B0A695]" />
                <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto custom-scrollbar">
                    {orderItems.length === 0 ? (
                        <div className="flex flex-col justify-center items-center w-full h-full text-[#776B5D]/60 text-center">
                            <ShoppingCart className="mb-3 sm:mb-4 w-12 sm:w-16 h-12 sm:h-16" />
                            <h3 className="font-bold text-base sm:text-lg">Your cart is empty</h3>
                            <p className="text-xs sm:text-sm">Click on a menu item to get started.</p>
                        </div>
                    ) : (
                        orderItems.map(item => {
                            const basePrice = item.selectedSize === 'small' ? item.small_price : 
                                              item.selectedSize === 'large' ? item.large_price : 
                                              item.medium_price;
                            const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
                                const addon = addonData.find(a => a.name === addonName && a.available);
                                return sum + (addon ? addon.price : 0);
                            }, 0) : 0;
                            const itemTotal = ((basePrice ?? 0) + addonsTotal) * item.quantity;

                            return (
                                <div key={item.orderId} className="flex bg-[#F3EEEA] sm:mb-3 p-3 sm:p-4 border border-[#B0A695] rounded-2xl w-full h-fit">
                                    <img src={item.image} alt={item.name} className="flex-shrink-0 mr-3 sm:mr-4 rounded-lg w-12 sm:w-16 h-12 sm:h-16 object-cover" />
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
                                                                <span className="ml-2 font-bold whitespace-nowrap">+{formatPrice(addon ? addon.price : 0)}</span>
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
                            className="flex justify-center items-center bg-[#776B5D] hover:bg-[#776B5D]/90 py-2 sm:py-3 rounded-lg w-full font-bold text-[#F3EEEA] text-sm sm:text-lg transition-colors duration-150"
                        >
                            <CreditCard className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                            <span className="hidden sm:inline">Proceed to Payment - {formatPrice(orderTotal)}</span>
                            <span className="sm:hidden">Pay {formatPrice(orderTotal)}</span>
                        </button>
                    </div>
                )}
            </div>
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