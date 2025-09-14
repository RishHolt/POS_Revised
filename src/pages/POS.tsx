import React, { useState, useMemo } from "react";
import MenuModal from "../components/modals/MenuModal"; // Assuming MenuModal accepts an onAddToOrder prop
import { Star, Trash2, ShoppingCart } from "lucide-react";
import { menuData, Category } from "../mocks/menuData";
import { addonData } from "../mocks/addonData";
import type { MenuItem } from "../mocks/menuData"; // type-only import for MenuItem
import SearchAndFilters from "../components/ui/SearchAndFilters";
import PageHeader from "../components/ui/PageHeader";

// --- NEW: Define a type for items in the order ---
interface OrderItem extends MenuItem {
    orderId: string; // Unique ID for each item in the order
    quantity: number;
    selectedSize: string;
    selectedAddons: string[];
}


const POS: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    
    // --- NEW: State for managing the current order ---
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    // --- NEW: State for user feedback animation ---
    const [justAddedId, setJustAddedId] = useState<string | null>(null);


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
        handleCloseModal();
    };
    
    // --- NEW: Functions to manage the cart ---
    const handleRemoveFromOrder = (orderId: string) => {
        setOrderItems(prev => prev.filter(item => item.orderId !== orderId));
    };

    const handleResetOrder = () => {
        setOrderItems([]);
    };


    return (
        <div className="flex lg:flex-row flex-col bg-[#F3EEEA] w-full h-full overflow-hidden">
            
            {/* Left: Cafe Menu */}
            <div className="flex flex-col flex-1 p-4 lg:p-8 min-h-0">
                <PageHeader
                    title="Point of Sale"
                    description="Process orders and manage your coffee shop transactions"
                />

                {/* Category buttons - matching Menu.tsx exactly */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                    {Category.map(c => (
                        <div key={c.value} className="flex justify-center items-center bg-white p-2 rounded-xl">
                            <button
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-normal transition-colors duration-150 w-full h-full ${activeFilter === c.value ? "bg-[#776B5D] text-[#F3EEEA]" : "bg-transparent text-[#776B5D]"}`}
                                onClick={() => setActiveFilter(c.value)}
                            >
                                {React.createElement(c.icon, { className: "w-5 h-5", color: activeFilter === c.value ? "#F3EEEA" : "#776B5D" })}
                                <span>{c.label}</span>
                            </button>
                        </div>
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
                <div className="flex pr-4 h-full overflow-y-auto custom-scrollbar">
                    <div className="gap-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 w-full">
                        {filteredMenu.map(item => (
                            <div
                                key={item.menu_id}
                                className={`flex flex-col items-start bg-white p-4 border rounded-xl transition duration-300 cursor-pointer hover:shadow-xl group border-[#B0A695] ${item.status === 'available' ? 'hover:border-[#776B5D]' : 'opacity-50 grayscale'} ${justAddedId === item.menu_id ? 'border-green-500 shadow-xl' : ''}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                <div className="relative w-full">
                                    <img src={item.image} alt={item.name} className="mb-3 rounded-lg w-full object-cover aspect-square" />
                                </div>
                                <div className="mb-4 w-full font-bold text-[#776B5D] text-xl truncate">{item.name}</div>
                                <div className={`mb-2 text-sm capitalize font-medium ${item.type === 'hot' ? 'text-red-500' : item.type === 'cold' ? 'text-blue-500' : 'text-[#776B5D]/70'}`}>{item.type.replace('-', ' ')}</div>
                                <div className="flex flex-wrap gap-2 mb-3 font-medium text-sm">
                                    {item.small_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">S {formatPrice(item.small_price)}</span>)}
                                    {item.medium_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">M {formatPrice(item.medium_price)}</span>)}
                                    {item.large_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">L {formatPrice(item.large_price)}</span>)}
                                </div>
                                <div className="flex justify-between mt-auto w-full">
                                    <div className={`font-medium text-sm ${item.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Current Order - FIXED LAYOUT */}
            <div className="flex flex-col bg-white shadow-lg border-[#B0A695] border-t lg:border-t-0 lg:border-l w-full lg:w-[400px] h-full">
                {/* Header */}
                <div className="flex flex-shrink-0 justify-between items-center p-6 pb-4">
                    <h2 className="font-bold text-[#776B5D] text-xl">Current Order</h2>
                    <button onClick={handleResetOrder} className="bg-[#B0A695]/20 hover:bg-red-100 px-3 py-1 rounded-lg font-medium text-[#776B5D] hover:text-red-600 transition">Reset</button>
                </div>
                <hr className="flex-shrink-0 mx-6 border-[#B0A695]" />
                
                {/* Order List - Scrollable Content with proper height calculation */}
                <div className="flex flex-col px-6 py-4 h-full overflow-y-auto custom-scrollbar">
                    {orderItems.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col justify-center items-center w-full h-full text-[#776B5D]/60 text-center">
                            <ShoppingCart className="mb-4 w-16 h-16" />
                            <h3 className="font-bold text-lg">Your cart is empty</h3>
                            <p className="text-sm">Click on a menu item to get started.</p>
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
                                <div key={item.orderId} className="flex bg-[#F3EEEA] mb-3 p-4 border border-[#B0A695] rounded-2xl w-full h-fit">
                                    <img src={item.image} alt={item.name} className="flex-shrink-0 mr-4 rounded-lg w-16 h-16 object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-2">
                                            <div className="overflow-hidden font-bold text-[#776B5D] text-lg text-ellipsis whitespace-nowrap">{item.name}</div>
                                            <div className="text-[#776B5D] text-sm capitalize">{item.type.replace('-', ' ')}</div>
                                            <div className="text-[#776B5D] text-sm">Size: {item.selectedSize ? item.selectedSize.charAt(0).toUpperCase() + item.selectedSize.slice(1) : 'Medium'}</div>
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
                                            <div className="text-[#776B5D] text-sm">{item.quantity}x</div>
                                            <div className="font-bold text-[#776B5D] text-lg">{formatPrice(itemTotal)}</div>
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
                    <div className="flex flex-col bg-white p-4 lg:p-6 border-[#B0A695]/20 border-t w-full h-fit">
                        <div className="flex justify-between mb-2 text-[#776B5D]">
                            <span>Discount</span>
                            <span>N/A</span>
                        </div>
                        <div className="flex justify-between mb-4 font-bold text-[#776B5D] text-lg">
                            <span>Total</span>
                            <span>{formatPrice(orderTotal)}</span>
                        </div>
                        <button className="bg-[#776B5D] hover:bg-[#776B5D]/90 py-3 rounded-lg w-full font-bold text-[#F3EEEA] text-lg transition-colors duration-150">Charge {formatPrice(orderTotal)}</button>
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