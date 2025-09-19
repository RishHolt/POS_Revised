import React, { useState, useMemo } from "react";
import {
    Banknote,
    Smartphone,
    ArrowLeft,
    CheckCircle,
    User,
    Search,
    Receipt,
    Star
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import FormField, { Input } from "../components/ui/FormField";
import { addonData } from "../mocks/addonData";
import {
    loyaltyMembers,
    getLoyaltyMemberByPhone,
    getSegmentColor,
    getSegmentIcon,
    type LoyaltyMember
} from "../mocks/loyaltyData";
import {
    calculateRewardValue,
    type Reward
} from "../mocks/rewardsData";
import type { OrderItem } from "../mocks/menuData";
import JoinLoyaltyModal from "../components/modals/JoinLoyaltyModal";
import SelectRewardsModal from "../components/modals/SelectRewardsModal";

interface PaymentProps {
    orderItems: OrderItem[];
    onBack: () => void;
    onPaymentComplete: (paymentData: PaymentData) => void;
}

interface PaymentData {
    orderId: string;
    customerName: string;
    customerNotes: string;
    paymentMethod: 'cash' | 'gcash';
    amountPaid: number;
    change: number;
    subtotal: number;
    rewardsDiscount: number;
    tax: number;
    total: number;
    loyaltyMember?: LoyaltyMember;
    selectedRewards: Reward[];
    timestamp: Date;
}

const Payment: React.FC<PaymentProps> = ({ orderItems, onBack, onPaymentComplete }) => {
    const [customerName, setCustomerName] = useState("");
    const [customerNotes, setCustomerNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');
    const [amountPaid, setAmountPaid] = useState("");
    const [loyaltySearch, setLoyaltySearch] = useState("");
    const [selectedLoyaltyMember, setSelectedLoyaltyMember] = useState<LoyaltyMember | null>(null);
    const [loyaltySearchResults, setLoyaltySearchResults] = useState<LoyaltyMember[]>([]);
    const [selectedRewards, setSelectedRewards] = useState<Reward[]>([]);
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    const [showJoinLoyaltyModal, setShowJoinLoyaltyModal] = useState(false);

    const subtotal = useMemo(() => {
        return orderItems.reduce((total, item) => {
            const basePrice = item.selectedSize === 'small' ? item.small_price :
                              item.selectedSize === 'large' ? item.large_price :
                              item.medium_price;
            const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
                const addon = addonData.find(a => a.name === addonName && a.available);
                return sum + (addon ? addon.price : 0);
            }, 0) : 0;
            return total + ((basePrice ?? 0) + addonsTotal) * item.quantity;
        }, 0);
    }, [orderItems]);

    const rewardsDiscount = useMemo(() => {
        return selectedRewards.reduce((total, reward) => {
            return total + calculateRewardValue(reward, subtotal);
        }, 0);
    }, [selectedRewards, subtotal]);

    const totalDiscounts = useMemo(() => rewardsDiscount, [rewardsDiscount]);
    const tax = useMemo(() => (subtotal - totalDiscounts) * 0.12, [subtotal, totalDiscounts]);
    const total = useMemo(() => subtotal - totalDiscounts + tax, [subtotal, totalDiscounts, tax]);
    const change = useMemo(() => {
        const paid = parseFloat(amountPaid) || 0;
        return Math.max(0, paid - total);
    }, [amountPaid, total]);

    const formatPrice = (price: number) => `₱${price.toFixed(2)}`;

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method as 'cash' | 'gcash');
        if (method !== 'cash') {
            setAmountPaid(total.toFixed(2));
        } else {
            setAmountPaid("");
        }
    };

    const handleLoyaltySearch = (searchTerm: string) => {
        setLoyaltySearch(searchTerm);
        if (searchTerm.trim() === "") {
            setLoyaltySearchResults([]);
            return;
        }

        const phoneMatch = getLoyaltyMemberByPhone(searchTerm);
        if (phoneMatch) {
            setLoyaltySearchResults([phoneMatch]);
            return;
        }

        const nameMatches = loyaltyMembers.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) && member.isActive
        );
        setLoyaltySearchResults(nameMatches.slice(0, 5));
    };

    const handleSelectLoyaltyMember = (member: LoyaltyMember) => {
        setSelectedLoyaltyMember(member);
        setCustomerName(member.name);
        setLoyaltySearch(member.name);
        setLoyaltySearchResults([]);
    };

    const handleRemoveLoyaltyMember = () => {
        setSelectedLoyaltyMember(null);
        setLoyaltySearch("");
        setSelectedRewards([]);
    };

    const handleSelectReward = (reward: Reward) => {
        setSelectedRewards(prev => [...prev, reward]);
    };

    const handleRemoveReward = (rewardId: string) => {
        setSelectedRewards(prev => prev.filter(reward => reward.id !== rewardId));
    };

    const handleJoinLoyalty = (customerData: { name: string; phone: string; email: string }) => {
        alert(`Welcome to our loyalty program, ${customerData.name}! You'll receive 100 welcome points.`);
        setCustomerName(customerData.name);
    };

    const handleConfirmPayment = () => {
        if (paymentMethod === 'cash' && parseFloat(amountPaid) < total) {
            alert("Amount paid must be greater than or equal to total amount");
            return;
        }

        const paymentData: PaymentData = {
            orderId: `ORD-${Date.now()}`,
            customerName,
            customerNotes,
            paymentMethod,
            amountPaid: parseFloat(amountPaid) || total,
            change,
            subtotal,
            rewardsDiscount,
            tax,
            total,
            loyaltyMember: selectedLoyaltyMember || undefined,
            selectedRewards,
            timestamp: new Date()
        };

        onPaymentComplete(paymentData);
    };

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: Banknote },
        { value: 'gcash', label: 'GCash - Unavailable', icon: Smartphone, disabled: true }
    ];

    return (
        <div className="flex lg:flex-row flex-col bg-[#F3EEEA] w-full h-full lg:overflow-hidden">
            {/* Left: Order Review & Customer Info */}
            <div className="flex flex-col flex-1 p-4 md:p-6 lg:p-8 lg:overflow-y-auto custom-scrollbar">
                <div className="flex md:flex-row flex-col md:items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        icon={ArrowLeft}
                        className="self-start"
                    >
                        Back to POS
                    </Button>
                    <PageHeader
                        title="Payment"
                        description="Review order and process payment"
                        className="mb-0"
                    />
                </div>

                {/* Order List */}
                <div className="bg-white shadow-sm mb-6 border border-[#B0A695]/20 rounded-xl">
                    <div className="p-4 md:p-6 border-[#B0A695]/20 border-b">
                        <h3 className="flex items-center font-semibold text-[#776B5D] text-lg">
                            <Receipt className="flex-shrink-0 mr-2 w-5 h-5" />
                            Order Summary
                        </h3>
                    </div>
                    <div className="p-4 md:p-6">
                        {orderItems.length === 0 ? (
                            <div className="py-8 text-[#776B5D]/60 text-center">
                                No items in order
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orderItems.map((item) => {
                                    const basePrice = item.selectedSize === 'small' ? item.small_price :
                                                      item.selectedSize === 'large' ? item.large_price :
                                                      item.medium_price;
                                    const addonsTotal = item.selectedAddons ? item.selectedAddons.reduce((sum, addonName) => {
                                        const addon = addonData.find(a => a.name === addonName && a.available);
                                        return sum + (addon ? addon.price : 0);
                                    }, 0) : 0;
                                    const itemTotal = ((basePrice ?? 0) + addonsTotal) * item.quantity;

                                    return (
                                        <div key={item.orderId} className="flex md:flex-row flex-col md:justify-between md:items-center gap-4 bg-[#F3EEEA] p-4 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="flex-shrink-0 rounded-lg w-14 md:w-16 h-14 md:h-16 object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-[#776B5D]">{item.name}</h4>
                                                    <p className="text-[#776B5D]/70 text-sm">
                                                        {item.selectedSize.charAt(0).toUpperCase() + item.selectedSize.slice(1)}
                                                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                            <span> • +{item.selectedAddons.length} add-ons</span>
                                                        )}
                                                    </p>
                                                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                        <div className="mt-1 text-[#776B5D]/60 text-xs">
                                                            {item.selectedAddons.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <div className="font-medium text-[#776B5D]">
                                                    {item.quantity}x {formatPrice(basePrice ?? 0)}
                                                </div>
                                                {addonsTotal > 0 && (
                                                    <div className="text-[#776B5D]/70 text-sm">
                                                        +{formatPrice(addonsTotal)}
                                                    </div>
                                                )}
                                                <div className="font-bold text-[#776B5D]">
                                                    {formatPrice(itemTotal)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white shadow-sm p-4 md:p-6 border border-[#B0A695]/20 rounded-xl">
                    <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4 mb-6">
                        <h3 className="flex items-center font-semibold text-[#776B5D] text-lg">
                            <User className="flex-shrink-0 mr-2 w-5 h-5" />
                            Customer Information
                        </h3>
                        <Button
                            variant="secondary"
                            onClick={() => setShowJoinLoyaltyModal(true)}
                            icon={Star}
                            className="self-start md:self-auto"
                        >
                            Join Loyalty Program
                        </Button>
                    </div>

                    <FormField label="Loyalty Search">
                        <div className="relative">
                            <Input
                                value={loyaltySearch}
                                onChange={(e) => handleLoyaltySearch(e.target.value)}
                                placeholder="Search by name or phone"
                                icon={Search}
                            />
                            {loyaltySearchResults.length > 0 && (
                                <div className="z-10 absolute bg-white shadow-lg mt-1 border border-[#B0A695] rounded-lg w-full max-h-60 overflow-y-auto">
                                    {loyaltySearchResults.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => handleSelectLoyaltyMember(member)}
                                            className="hover:bg-[#F3EEEA] p-3 border-[#B0A695]/20 border-b last:border-b-0 cursor-pointer"
                                        >
                                            <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-2">
                                                <div className="min-w-0">
                                                    <div className="font-medium text-[#776B5D]">{member.name}</div>
                                                    <div className="text-[#776B5D]/70 text-sm">{member.phone}</div>
                                                </div>
                                                <div className="flex-shrink-0 text-left md:text-right">
                                                    <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getSegmentColor(member.segment)}`}>
                                                        {member.segment.toUpperCase()}
                                                    </div>
                                                    <div className="mt-1 text-[#776B5D]/70 text-sm">{member.points} pts</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </FormField>

                    {selectedLoyaltyMember && (
                        <div className="bg-[#F3EEEA] mt-4 p-4 border border-[#B0A695]/20 rounded-lg">
                            <div className="flex md:flex-row flex-col justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex md:flex-row flex-col items-start md:items-center gap-2 mb-2">
                                        <span className="font-medium text-[#776B5D]">{selectedLoyaltyMember.name}</span>
                                        <span className={`inline-flex items-center self-start rounded-full px-2 py-1 text-xs font-medium ${getSegmentColor(selectedLoyaltyMember.segment)}`}>
                                            {getSegmentIcon(selectedLoyaltyMember.segment)} {selectedLoyaltyMember.segment.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-[#776B5D]/70 text-sm">
                                        Available Points: <span className="font-medium text-[#776B5D]">{selectedLoyaltyMember.points}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveLoyaltyMember}
                                    className="flex-shrink-0 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="flex md:flex-row flex-col md:justify-between items-start md:items-center gap-3 mb-3">
                                    <h4 className="font-medium text-[#776B5D]">Available Rewards</h4>
                                    <button
                                        onClick={() => setShowRewardsModal(true)}
                                        className="self-start md:self-auto bg-[#776B5D] hover:bg-[#776B5D]/90 px-3 py-1 rounded-lg text-white text-sm transition-colors"
                                    >
                                        Select Rewards
                                    </button>
                                </div>

                                {selectedRewards.length > 0 && (
                                    <div className="space-y-2">
                                        {selectedRewards.map((reward) => (
                                            <div key={reward.id} className="flex justify-between items-center bg-white p-3 border border-[#B0A695]/20 rounded-lg">
                                                <div className="flex flex-1 items-center gap-3 min-w-0">
                                                    <div className="flex flex-shrink-0 justify-center items-center bg-[#776B5D]/10 rounded-full w-6 h-6">
                                                        <span className="font-medium text-[#776B5D] text-xs">
                                                            {reward.type.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-[#776B5D] text-sm">{reward.name}</div>
                                                        <div className="text-[#776B5D]/70 text-xs">{reward.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-shrink-0 items-center gap-2">
                                                    <span className="font-medium text-[#776B5D] text-sm">{reward.pointsRequired} pts</span>
                                                    <button
                                                        onClick={() => handleRemoveReward(reward.id)}
                                                        className="hover:bg-red-50 rounded-full w-8 h-8 text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedRewards.length === 0 && (
                                    <div className="py-2 text-[#776B5D]/60 text-sm text-center">
                                        No rewards selected.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!selectedLoyaltyMember && (
                        <FormField label="Customer Name" className="mt-4">
                            <Input
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Enter customer name"
                                icon={User}
                            />
                        </FormField>
                    )}

                    <FormField label="Notes" className="mt-4">
                        <textarea
                            value={customerNotes}
                            onChange={(e) => setCustomerNotes(e.target.value)}
                            placeholder="Special instructions or notes..."
                            className="px-3 py-2 border border-[#B0A695] focus:border-transparent rounded-lg focus:ring-[#776B5D] focus:ring-2 w-full text-[#776B5D] placeholder:text-[#776B5D]/50 resize-none"
                            rows={3}
                        />
                    </FormField>
                </div>
            </div>

            {/* Right: Payment Details */}
            <div className="flex flex-col lg:flex-shrink-0 bg-white shadow-lg border-[#B0A695] border-t lg:border-t-0 lg:border-l w-full lg:w-[400px] lg:h-full">
                <div className="flex flex-shrink-0 justify-between items-center p-4 md:p-6 pb-4">
                    <h2 className="font-bold text-[#776B5D] text-xl">Payment Summary</h2>
                </div>
                <hr className="flex-shrink-0 mx-4 md:mx-6 border-[#B0A695]" />

                <div className="flex flex-col flex-1 px-4 md:px-6 py-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-[#776B5D]">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        {rewardsDiscount > 0 && (
                            <div className="flex justify-between text-blue-600">
                                <span>Rewards Discount</span>
                                <span>-{formatPrice(rewardsDiscount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[#776B5D]">
                            <span>Tax (12%)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>
                        <hr className="border-[#B0A695]/20" />
                        <div className="flex justify-between font-bold text-[#776B5D] text-xl">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Payment Method</h3>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.value}
                                        onClick={() => !method.disabled && handlePaymentMethodChange(method.value)}
                                        disabled={method.disabled}
                                        className={`flex w-full items-center rounded-lg border p-3 transition-colors ${
                                            method.disabled
                                                ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50'
                                                : paymentMethod === method.value
                                                ? 'border-[#776B5D] bg-[#776B5D]/10'
                                                : 'border-[#B0A695] hover:border-[#776B5D]/50'
                                        }`}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${method.disabled ? 'text-gray-400' : 'text-[#776B5D]'}`} />
                                        <span className={`font-medium ${method.disabled ? 'text-gray-400' : 'text-[#776B5D]'}`}>
                                            {method.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-4 font-semibold text-[#776B5D] text-lg">Payment Details</h3>
                        {paymentMethod === 'cash' && (
                            <FormField label="Amount Received">
                                <Input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    placeholder="Enter amount received"
                                    icon={Banknote}
                                />
                            </FormField>
                        )}
                        {paymentMethod === 'cash' && change > 0 && (
                            <div className="bg-green-50 mt-4 p-4 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-green-800">Change Due</span>
                                    <span className="font-bold text-green-800 text-xl">{formatPrice(change)}</span>
                                </div>
                            </div>
                        )}
                        {paymentMethod === 'gcash' && (
                            <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
                                <div className="flex items-center text-red-800">
                                    <span className="font-medium">GCash payment is currently unavailable</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col bg-white p-4 md:p-6 border-[#B0A695]/20 border-t w-full">
                    <div className="space-y-3">
                        <Button
                            onClick={handleConfirmPayment}
                            size="lg"
                            className="w-full"
                            disabled={paymentMethod === 'gcash' || (paymentMethod === 'cash' && (!amountPaid || parseFloat(amountPaid) < total))}
                        >
                            <CheckCircle className="mr-2 w-5 h-5" />
                            Confirm Payment - {formatPrice(total)}
                        </Button>
                        <Button
                            onClick={onBack}
                            variant="secondary"
                            size="lg"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            {showRewardsModal && selectedLoyaltyMember && (
                <SelectRewardsModal
                    isOpen={true}
                    onClose={() => setShowRewardsModal(false)}
                    loyaltyMember={selectedLoyaltyMember}
                    subtotal={subtotal}
                    selectedRewards={selectedRewards}
                    onSelectReward={handleSelectReward}
                    onRemoveReward={handleRemoveReward}
                />
            )}

            <JoinLoyaltyModal
                isOpen={showJoinLoyaltyModal}
                onClose={() => setShowJoinLoyaltyModal(false)}
                onJoin={handleJoinLoyalty}
            />
        </div>
    );
};

export default Payment;