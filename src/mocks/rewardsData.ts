export type RewardType = "discount" | "free_item" | "percentage_off" | "buy_one_get_one";

export interface Reward {
    id: string;
    name: string;
    description: string;
    type: RewardType;
    pointsRequired: number;
    discountAmount?: number; // For fixed discount rewards
    discountPercentage?: number; // For percentage discount rewards
    maxDiscountAmount?: number; // Maximum discount cap
    freeItemName?: string; // For free item rewards
    minPurchaseAmount?: number; // Minimum purchase required
    isActive: boolean;
    createdAt: Date;
    redeemedCount: number;
}

export const rewardsData: Reward[] = [
    {
        id: "RWD001",
        name: "₱50 Discount",
        description: "₱50 off on your next purchase",
        type: "discount",
        pointsRequired: 100,
        discountAmount: 50,
        isActive: true,
        createdAt: new Date("2023-01-01"),
        redeemedCount: 24
    },
    {
        id: "RWD002",
        name: "Buy 1 Take 1",
        description: "Buy one item, get one free (same or lesser value)",
        type: "free_item",
        pointsRequired: 75,
        freeItemName: "Any item",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        redeemedCount: 42
    },
    {
        id: "RWD003",
        name: "₱100 Discount",
        description: "₱100 off on purchases above ₱500",
        type: "discount",
        pointsRequired: 200,
        discountAmount: 100,
        minPurchaseAmount: 500,
        isActive: true,
        createdAt: new Date("2023-02-15"),
        redeemedCount: 18
    },
    {
        id: "RWD004",
        name: "20% Discount",
        description: "20% off on your entire purchase",
        type: "percentage_off",
        pointsRequired: 300,
        discountPercentage: 20,
        maxDiscountAmount: 200,
        isActive: true,
        createdAt: new Date("2023-01-10"),
        redeemedCount: 15
    },
    {
        id: "RWD005",
        name: "Free Coffee",
        description: "Free medium coffee of your choice",
        type: "free_item",
        pointsRequired: 150,
        freeItemName: "Medium Coffee",
        isActive: true,
        createdAt: new Date("2023-03-01"),
        redeemedCount: 8
    },
    {
        id: "RWD006",
        name: "15% Off",
        description: "15% off on orders above ₱300",
        type: "percentage_off",
        pointsRequired: 180,
        discountPercentage: 15,
        maxDiscountAmount: 150,
        minPurchaseAmount: 300,
        isActive: true,
        createdAt: new Date("2023-03-15"),
        redeemedCount: 12
    },
    {
        id: "RWD007",
        name: "Free Pastry",
        description: "Free pastry with any drink purchase",
        type: "free_item",
        pointsRequired: 120,
        freeItemName: "Any Pastry",
        isActive: true,
        createdAt: new Date("2023-04-01"),
        redeemedCount: 6
    },
    {
        id: "RWD008",
        name: "₱200 Discount",
        description: "₱200 off on purchases above ₱1000",
        type: "discount",
        pointsRequired: 400,
        discountAmount: 200,
        minPurchaseAmount: 1000,
        isActive: true,
        createdAt: new Date("2023-04-15"),
        redeemedCount: 3
    }
];

// Helper functions
export const getAvailableRewards = (customerPoints: number, subtotal: number): Reward[] => {
    return rewardsData.filter(reward => 
        reward.isActive && 
        reward.pointsRequired <= customerPoints &&
        (!reward.minPurchaseAmount || subtotal >= reward.minPurchaseAmount)
    );
};

export const calculateRewardValue = (reward: Reward, subtotal: number): number => {
    switch (reward.type) {
        case "discount":
            return reward.discountAmount || 0;
        case "percentage_off":
            const discountAmount = (subtotal * (reward.discountPercentage || 0)) / 100;
            return Math.min(discountAmount, reward.maxDiscountAmount || discountAmount);
        case "free_item":
            // For free items, we'll return 0 as the value is subjective
            // In a real system, you'd calculate based on the item's price
            return 0;
        case "buy_one_get_one":
            // For BOGO, we'll return 0 as the value depends on the items selected
            return 0;
        default:
            return 0;
    }
};

export const getRewardTypeIcon = (type: RewardType): string => {
    switch (type) {
        case "discount":
            return "💰";
        case "free_item":
            return "🎁";
        case "percentage_off":
            return "📊";
        case "buy_one_get_one":
            return "🔄";
        default:
            return "🎁";
    }
};

export const getRewardTypeColor = (type: RewardType): string => {
    switch (type) {
        case "discount":
            return "text-green-600 bg-green-100";
        case "free_item":
            return "text-purple-600 bg-purple-100";
        case "percentage_off":
            return "text-blue-600 bg-blue-100";
        case "buy_one_get_one":
            return "text-orange-600 bg-orange-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};
