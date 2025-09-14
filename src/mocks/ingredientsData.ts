export interface Ingredient {
	id: string;
	name: string;
	unit: string;
	stock: number;
	minStock: number;
	cost: number;
	category: 'liquid' | 'solid' | 'powder' | 'syrup' | 'other';
}

export interface Cup {
	id: string;
	name: string;
	size: 'small' | 'medium' | 'large';
	capacity: number; // in ml
	unit: string;
	cost: number;
	stock: number;
}

export const ingredientsList: Ingredient[] = [
	{ id: 'milk', name: 'Fresh Milk', unit: 'ml', stock: 2000, minStock: 500, cost: 0.05, category: 'liquid' },
	{ id: 'sugar', name: 'White Sugar', unit: 'g', stock: 5000, minStock: 1000, cost: 0.02, category: 'powder' },
	{ id: 'coffee-beans', name: 'Coffee Beans', unit: 'g', stock: 2000, minStock: 500, cost: 0.15, category: 'solid' },
	{ id: 'chocolate-syrup', name: 'Chocolate Syrup', unit: 'ml', stock: 1500, minStock: 300, cost: 0.08, category: 'syrup' },
	{ id: 'vanilla-syrup', name: 'Vanilla Syrup', unit: 'ml', stock: 1000, minStock: 200, cost: 0.06, category: 'syrup' },
	{ id: 'caramel-syrup', name: 'Caramel Syrup', unit: 'ml', stock: 800, minStock: 150, cost: 0.07, category: 'syrup' },
	{ id: 'hazelnut-syrup', name: 'Hazelnut Syrup', unit: 'ml', stock: 600, minStock: 100, cost: 0.09, category: 'syrup' },
	{ id: 'ice', name: 'Ice Cubes', unit: 'cups', stock: 50, minStock: 10, cost: 0.01, category: 'solid' },
	{ id: 'whipped-cream', name: 'Whipped Cream', unit: 'ml', stock: 1000, minStock: 200, cost: 0.12, category: 'liquid' },
	{ id: 'cinnamon', name: 'Cinnamon Powder', unit: 'g', stock: 200, minStock: 50, cost: 0.25, category: 'powder' },
	{ id: 'cocoa-powder', name: 'Cocoa Powder', unit: 'g', stock: 500, minStock: 100, cost: 0.20, category: 'powder' },
	{ id: 'matcha-powder', name: 'Matcha Powder', unit: 'g', stock: 300, minStock: 75, cost: 0.30, category: 'powder' },
];

export const cupsList: Cup[] = [
	{ id: 'cup-sm', name: '8oz Paper Cup', size: 'small', capacity: 240, unit: 'ml', cost: 0.15, stock: 1000 },
	{ id: 'cup-md', name: '12oz Plastic Cup', size: 'medium', capacity: 355, unit: 'ml', cost: 0.20, stock: 800 },
	{ id: 'cup-lg', name: '16oz Reusable Cup', size: 'large', capacity: 473, unit: 'ml', cost: 0.25, stock: 500 },
	{ id: 'cup-sm-glass', name: '8oz Glass Cup', size: 'small', capacity: 240, unit: 'ml', cost: 0.30, stock: 200 },
	{ id: 'cup-md-glass', name: '12oz Glass Cup', size: 'medium', capacity: 355, unit: 'ml', cost: 0.40, stock: 150 },
	{ id: 'cup-lg-glass', name: '16oz Glass Cup', size: 'large', capacity: 473, unit: 'ml', cost: 0.50, stock: 100 },
];