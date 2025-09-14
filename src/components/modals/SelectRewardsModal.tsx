import React from "react";
import { Check } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { 
    getAvailableRewards, 
    calculateRewardValue,
    getRewardTypeColor,
    type Reward
} from "../../mocks/rewardsData";
import type { LoyaltyMember } from "../../mocks/loyaltyData";

interface SelectRewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    loyaltyMember: LoyaltyMember;
    subtotal: number;
    selectedRewards: Reward[];
    onSelectReward: (reward: Reward) => void;
    onRemoveReward: (rewardId: string) => void;
}

const SelectRewardsModal: React.FC<SelectRewardsModalProps> = ({
    isOpen,
    onClose,
    loyaltyMember,
    subtotal,
    selectedRewards,
    onSelectReward,
    onRemoveReward
}) => {
    const formatPrice = (price: number) => `₱${price.toFixed(2)}`;

    const getAvailableRewardsForCustomer = (): Reward[] => {
        return getAvailableRewards(loyaltyMember.points, subtotal);
    };

    const handleRewardClick = (reward: Reward) => {
        const isSelected = selectedRewards.some(selected => selected.id === reward.id);
        if (isSelected) {
            onRemoveReward(reward.id);
        } else {
            const totalPointsUsed = selectedRewards.reduce((sum, r) => sum + r.pointsRequired, 0);
            const canSelect = (totalPointsUsed + reward.pointsRequired) <= loyaltyMember.points;
            if (canSelect) {
                onSelectReward(reward);
            }
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Select Rewards"
            size="lg"
            footer={
                <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-[#776B5D]/70">
                        Total Points Used: {selectedRewards.reduce((sum, r) => sum + r.pointsRequired, 0)} / {loyaltyMember.points}
                    </div>
                    <Button onClick={onClose}>
                        Done
                    </Button>
                </div>
            }
        >
            <div className="space-y-1">
                <p className="text-[#776B5D]/70 mb-4">
                    Available Points: <span className="font-medium text-[#776B5D]">{loyaltyMember.points}</span>
                </p>
                
                <div className="space-y-3">
                    {getAvailableRewardsForCustomer().map((reward) => {
                        const isSelected = selectedRewards.some(selected => selected.id === reward.id);
                        const totalPointsUsed = selectedRewards.reduce((sum, r) => sum + r.pointsRequired, 0);
                        const canSelect = (totalPointsUsed + reward.pointsRequired) <= loyaltyMember.points;
                        
                        return (
                            <div
                                key={reward.id}
                                className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                                    isSelected 
                                        ? 'border-[#776B5D] bg-[#776B5D]/10' 
                                        : canSelect 
                                        ? 'border-[#B0A695] hover:border-[#776B5D]/50 hover:bg-[#F3EEEA]' 
                                        : 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                                }`}
                                onClick={() => handleRewardClick(reward)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#776B5D]/10">
                                            {isSelected ? (
                                                <Check className="w-4 h-4 text-[#776B5D]" />
                                            ) : (
                                                <span className="text-sm font-medium text-[#776B5D]">
                                                    {reward.type.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-[#776B5D]">{reward.name}</div>
                                            <div className="text-sm text-[#776B5D]/70 mt-1">{reward.description}</div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRewardTypeColor(reward.type)}`}>
                                                {reward.type.replace('_', ' ').toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-[#776B5D]">{reward.pointsRequired} pts</div>
                                        {calculateRewardValue(reward, subtotal) > 0 && (
                                            <div className="text-sm text-green-600">
                                                Value: {formatPrice(calculateRewardValue(reward, subtotal))}
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="text-sm text-[#776B5D] font-medium">Selected</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {getAvailableRewardsForCustomer().length === 0 && (
                        <div className="text-center py-8 text-[#776B5D]/60">
                            No rewards available for this customer.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SelectRewardsModal;
