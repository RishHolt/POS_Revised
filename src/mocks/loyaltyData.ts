export type LoyaltySegment = "regular" | "vip" | "premium";

export interface LoyaltyMember {
    id: string;
    name: string;
    phone: string;
    email: string;
    points: number;
    segment: LoyaltySegment;
    totalSpent: number;
    joinDate: Date;
    lastVisit: Date;
    isActive: boolean;
}

export interface LoyaltyDiscount {
    segment: LoyaltySegment;
    pointsRequired: number;
    discountPercentage: number;
    maxDiscountAmount: number;
    description: string;
}

// Loyalty discount tiers
export const loyaltyDiscounts: LoyaltyDiscount[] = [
    {
        segment: "regular",
        pointsRequired: 100,
        discountPercentage: 5,
        maxDiscountAmount: 50,
        description: "5% off (max ₱50)"
    },
    {
        segment: "regular",
        pointsRequired: 200,
        discountPercentage: 10,
        maxDiscountAmount: 100,
        description: "10% off (max ₱100)"
    },
    {
        segment: "vip",
        pointsRequired: 150,
        discountPercentage: 8,
        maxDiscountAmount: 80,
        description: "8% off (max ₱80)"
    },
    {
        segment: "vip",
        pointsRequired: 300,
        discountPercentage: 15,
        maxDiscountAmount: 200,
        description: "15% off (max ₱200)"
    },
    {
        segment: "premium",
        pointsRequired: 200,
        discountPercentage: 12,
        maxDiscountAmount: 150,
        description: "12% off (max ₱150)"
    },
    {
        segment: "premium",
        pointsRequired: 500,
        discountPercentage: 20,
        maxDiscountAmount: 500,
        description: "20% off (max ₱500)"
    }
];

// Mock loyalty members data
export const loyaltyMembers: LoyaltyMember[] = [
    {
        id: "LM001",
        name: "John Smith",
        phone: "+63 912 345 6789",
        email: "john.smith@email.com",
        points: 450,
        segment: "vip",
        totalSpent: 2500,
        joinDate: new Date("2023-01-15"),
        lastVisit: new Date("2024-01-10"),
        isActive: true
    },
    {
        id: "LM002",
        name: "Maria Garcia",
        phone: "+63 917 234 5678",
        email: "maria.garcia@email.com",
        points: 120,
        segment: "regular",
        totalSpent: 800,
        joinDate: new Date("2023-06-20"),
        lastVisit: new Date("2024-01-08"),
        isActive: true
    },
    {
        id: "LM003",
        name: "David Johnson",
        phone: "+63 918 345 6789",
        email: "david.johnson@email.com",
        points: 750,
        segment: "premium",
        totalSpent: 5000,
        joinDate: new Date("2022-11-10"),
        lastVisit: new Date("2024-01-12"),
        isActive: true
    },
    {
        id: "LM004",
        name: "Sarah Wilson",
        phone: "+63 919 456 7890",
        email: "sarah.wilson@email.com",
        points: 80,
        segment: "regular",
        totalSpent: 400,
        joinDate: new Date("2023-09-05"),
        lastVisit: new Date("2024-01-05"),
        isActive: true
    },
    {
        id: "LM005",
        name: "Michael Brown",
        phone: "+63 920 567 8901",
        email: "michael.brown@email.com",
        points: 320,
        segment: "vip",
        totalSpent: 1800,
        joinDate: new Date("2023-03-12"),
        lastVisit: new Date("2024-01-09"),
        isActive: true
    },
    {
        id: "LM006",
        name: "Lisa Davis",
        phone: "+63 921 678 9012",
        email: "lisa.davis@email.com",
        points: 950,
        segment: "premium",
        totalSpent: 7500,
        joinDate: new Date("2022-08-15"),
        lastVisit: new Date("2024-01-11"),
        isActive: true
    },
    {
        id: "LM007",
        name: "Robert Miller",
        phone: "+63 922 789 0123",
        email: "robert.miller@email.com",
        points: 60,
        segment: "regular",
        totalSpent: 300,
        joinDate: new Date("2023-12-01"),
        lastVisit: new Date("2024-01-03"),
        isActive: true
    },
    {
        id: "LM008",
        name: "Jennifer Taylor",
        phone: "+63 923 890 1234",
        email: "jennifer.taylor@email.com",
        points: 180,
        segment: "vip",
        totalSpent: 1200,
        joinDate: new Date("2023-05-18"),
        lastVisit: new Date("2024-01-07"),
        isActive: true
    }
];

// Helper functions
export const getLoyaltyMemberByPhone = (phone: string): LoyaltyMember | undefined => {
    return loyaltyMembers.find(member => member.phone === phone && member.isActive);
};

export const getLoyaltyMemberByName = (name: string): LoyaltyMember | undefined => {
    return loyaltyMembers.find(member => 
        member.name.toLowerCase().includes(name.toLowerCase()) && member.isActive
    );
};

export const getAvailableDiscounts = (member: LoyaltyMember): LoyaltyDiscount[] => {
    return loyaltyDiscounts.filter(discount => 
        discount.segment === member.segment && 
        member.points >= discount.pointsRequired
    );
};

export const calculateLoyaltyDiscount = (member: LoyaltyMember, subtotal: number): number => {
    const availableDiscounts = getAvailableDiscounts(member);
    if (availableDiscounts.length === 0) return 0;
    
    // Get the best discount (highest percentage)
    const bestDiscount = availableDiscounts.reduce((best, current) => 
        current.discountPercentage > best.discountPercentage ? current : best
    );
    
    const discountAmount = (subtotal * bestDiscount.discountPercentage) / 100;
    return Math.min(discountAmount, bestDiscount.maxDiscountAmount);
};

export const getSegmentColor = (segment: LoyaltySegment): string => {
    switch (segment) {
        case "regular":
            return "text-blue-600 bg-blue-100";
        case "vip":
            return "text-purple-600 bg-purple-100";
        case "premium":
            return "text-yellow-600 bg-yellow-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

export const getSegmentIcon = (segment: LoyaltySegment): string => {
    switch (segment) {
        case "regular":
            return "⭐";
        case "vip":
            return "👑";
        case "premium":
            return "💎";
        default:
            return "⭐";
    }
};


