export interface AddonItem {
	id: string;
	name: string;
	price: number;
	category: 'syrup' | 'sauce' | 'topping' | 'extra' | 'milk';
	description?: string;
	available: boolean;
}

export const addonData: AddonItem[] = [
	{ id: "espresso-shot", name: "Extra Espresso Shot", price: 25, category: 'extra', description: "Additional shot of espresso", available: true },
	{ id: "caramel-syrup", name: "Caramel Syrup", price: 15, category: 'syrup', description: "Sweet caramel flavoring", available: true },
	{ id: "vanilla-syrup", name: "Vanilla Syrup", price: 15, category: 'syrup', description: "Classic vanilla flavoring", available: true },
	{ id: "hazelnut-syrup", name: "Hazelnut Syrup", price: 15, category: 'syrup', description: "Rich hazelnut flavoring", available: true },
	{ id: "blueberry-syrup", name: "Blueberry Syrup", price: 15, category: 'syrup', description: "Fruity blueberry flavoring", available: true },
	{ id: "strawberry-syrup", name: "Strawberry Syrup", price: 15, category: 'syrup', description: "Sweet strawberry flavoring", available: true },
	{ id: "green-apple-syrup", name: "Green Apple Syrup", price: 15, category: 'syrup', description: "Tart green apple flavoring", available: true },
	{ id: "mango-syrup", name: "Mango Syrup", price: 15, category: 'syrup', description: "Tropical mango flavoring", available: true },
	{ id: "lychee-syrup", name: "Lychee Syrup", price: 15, category: 'syrup', description: "Exotic lychee flavoring", available: true },
	{ id: "chocolate-sauce", name: "Chocolate Sauce", price: 20, category: 'sauce', description: "Rich chocolate drizzle", available: true },
	{ id: "caramel-sauce", name: "Caramel Sauce", price: 20, category: 'sauce', description: "Sweet caramel drizzle", available: true },
	{ id: "white-chocolate-sauce", name: "White Chocolate Sauce", price: 20, category: 'sauce', description: "Creamy white chocolate drizzle", available: true },
	{ id: "whipped-cream", name: "Whipped Cream", price: 10, category: 'topping', description: "Light and fluffy cream", available: true },
	{ id: "cinnamon-powder", name: "Cinnamon Powder", price: 5, category: 'topping', description: "Warm spice dusting", available: true },
	{ id: "cocoa-powder", name: "Cocoa Powder", price: 5, category: 'topping', description: "Rich chocolate dusting", available: true },
	{ id: "oat-milk", name: "Oat Milk", price: 8, category: 'milk', description: "Creamy plant-based milk", available: true },
	{ id: "almond-milk", name: "Almond Milk", price: 8, category: 'milk', description: "Nutty plant-based milk", available: true },
	{ id: "soy-milk", name: "Soy Milk", price: 8, category: 'milk', description: "Smooth plant-based milk", available: true },
	{ id: "coconut-milk", name: "Coconut Milk", price: 8, category: 'milk', description: "Tropical plant-based milk", available: true },
];