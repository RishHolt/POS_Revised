// MenuModal.tsx
import React, { useState, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import { addonData } from "../../mocks/addonData";
import type { MenuItem } from "../../mocks/menuData";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export interface MenuModalProps {
    item: MenuItem;
    open: boolean;
    onClose: () => void;
    onAddToOrder: (itemToAdd: MenuItem, quantity: number, selectedSize: string, selectedAddons: string[]) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ item, open, onClose, onAddToOrder }) => {
    const [selectedSize, setSelectedSize] = useState<string>("medium");
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);

    const total = useMemo(() => {
        const basePrice = selectedSize === "small" ? item.small_price : selectedSize === "large" ? item.large_price : item.medium_price;
        const addonsTotal = selectedAddons.reduce((sum, addonName) => {
            const addon = addonData.find(a => a.name === addonName && a.available);
            return sum + (addon ? addon.price : 0);
        }, 0);
        return ((basePrice ?? 0) + addonsTotal) * quantity;
    }, [selectedSize, selectedAddons, quantity, item]);

    const formatPrice = (price: number | undefined) => price ? `₱${price}` : "N/A";

    const handleAddonToggle = (addonName: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
        );
    };
    
    const isOrderable = item.status === "available";

    const footer = !isOrderable ? (
        <div className="bg-[#B0A695]/20 py-3 rounded-lg w-full font-bold text-[#776B5D]/50 text-center">
            Currently Unavailable
        </div>
    ) : (
        <div className="flex w-full justify-between items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    aria-label="Decrease quantity"
                >
                    <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 font-bold text-[#776B5D] text-lg text-center">{quantity}</span>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(q => q + 1)} 
                    aria-label="Increase quantity"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            {/* Action Button */}
            <Button
                onClick={() => onAddToOrder(item, quantity, selectedSize, selectedAddons)}
                className="flex-1 sm:flex-none"
            >
                Add to Order • {formatPrice(total)}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={item.name}
            size="md"
            footer={footer}
            className="h-[95vh] max-h-[700px]"
        >
            {/* Image Banner */}
            <div className="relative w-full h-48 mb-6">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            </div>

            <div className="space-y-6">
                <p className="text-[#776B5D] text-sm capitalize">{item.type.replace("-", " ")}</p>

                {/* Drink Size Options */}
                <div>
                    <h3 className="mb-3 font-semibold text-[#776B5D]">Size</h3>
                    <div className="flex gap-2">
                        {item.small_price && (
                            <Button
                                variant={selectedSize === "small" ? "primary" : "secondary"}
                                onClick={() => setSelectedSize("small")}
                                className="flex-1"
                            >
                                Small <span className="font-semibold ml-1">{formatPrice(item.small_price)}</span>
                            </Button>
                        )}
                        {item.medium_price && (
                            <Button
                                variant={selectedSize === "medium" ? "primary" : "secondary"}
                                onClick={() => setSelectedSize("medium")}
                                className="flex-1"
                            >
                                Medium <span className="font-semibold ml-1">{formatPrice(item.medium_price)}</span>
                            </Button>
                        )}
                        {item.large_price && (
                            <Button
                                variant={selectedSize === "large" ? "primary" : "secondary"}
                                onClick={() => setSelectedSize("large")}
                                className="flex-1"
                            >
                                Large <span className="font-semibold ml-1">{formatPrice(item.large_price)}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Add-Ons Options */}
                {addonData.filter(addon => addon.available).length > 0 && (
                    <div>
                        <h3 className="mb-3 font-semibold text-[#776B5D]">Add-Ons</h3>
                        <div className="space-y-3">
                            {addonData
                                .filter(addon => addon.available)
                                .map(addon => (
                                <Button
                                    key={addon.id}
                                    variant={selectedAddons.includes(addon.name) ? "primary" : "secondary"}
                                    onClick={() => handleAddonToggle(addon.name)}
                                    className="w-full !justify-between !items-start !flex"
                                >
                                    <div className="flex flex-col items-start">
                                        <span>{addon.name}</span>
                                        {addon.description && (
                                            <span className="text-xs opacity-75 mt-1">{addon.description}</span>
                                        )}
                                    </div>
                                    <span className="font-semibold">+ {formatPrice(addon.price)}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MenuModal;