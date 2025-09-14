import { Clipboard } from "lucide-react";
import CapuccinoImg from "../assets/images/Capuccino.png";
import IcedCapuccinoImg from "../assets/images/Iced_Capuccino.png";
import AmericanoImg from "../assets/images/Brusko.png";
import MochaImg from "../assets/images/Mocha.png";
import VanillaLatteImg from "../assets/images/Hot_Vanilla_Latte.png";
import CaramelFrappeImg from "../assets/images/Iced_Mocha_Late.png";
import StrawberrySodaImg from "../assets/images/Iced_brusko.png";
import MatchaMilkTeaImg from "../assets/images/Hot_Vanilla_Latte.png";
import HazelnutFrappeImg from "../assets/images/Iced_Mocha_Late.png";
import ClassicSodaImg from "../assets/images/Iced_brusko.png";

export type MenuType = "hot" | "cold" | "milk-tea" | "frappe" | "soda";
export type MenuStatus = "available" | "unavailable";

export interface MenuIngredient {
	ingredientId: string;
	quantity: number;
	unit: string;
}

export interface MenuItem {
	menu_id: string;
	name: string;
	image: string;
	type: MenuType;
	status: MenuStatus;
	small_price: number | null;
	medium_price: number | null;
	large_price: number | null;
	description?: string;
	ingredients: {
		small: MenuIngredient[];
		medium: MenuIngredient[];
		large: MenuIngredient[];
	};
	cups: {
		small: string | null; // cup ID
		medium: string | null;
		large: string | null;
	};
	prepTime: number; // in minutes
	calories: {
		small: number | null;
		medium: number | null;
		large: number | null;
	};
}


export const Category = [
	{ label: "All Items", value: "all", icon: Clipboard },
	{ label: "Hot", value: "hot", icon: Clipboard },
	{ label: "Iced", value: "cold", icon: Clipboard },
	{ label: "Milk Tea", value: "milk-tea", icon: Clipboard },
	{ label: "Frappe", value: "frappe", icon: Clipboard },
	{ label: "Soda", value: "soda", icon: Clipboard },
];

export const menuData: MenuItem[] = [
	{
		menu_id: "1",
		name: "Cappuccino",
	image: CapuccinoImg,
		type: "hot",
		status: "available",
		small_price: 100,
		medium_price: 200,
		large_price: null,
		description: "Classic Italian coffee with steamed milk and foam",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 15, unit: "g" },
				{ ingredientId: "milk", quantity: 120, unit: "ml" },
				{ ingredientId: "sugar", quantity: 5, unit: "g" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 20, unit: "g" },
				{ ingredientId: "milk", quantity: 180, unit: "ml" },
				{ ingredientId: "sugar", quantity: 8, unit: "g" }
			],
			large: []
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: null
		},
		prepTime: 3,
		calories: {
			small: 80,
			medium: 120,
			large: null
		}
	},
	{
		menu_id: "2",
		name: "Iced Cappuccino",
	image: IcedCapuccinoImg,
		type: "cold",
		status: "available",
		small_price: 100,
		medium_price: 200,
		large_price: 300,
		description: "Refreshing iced version of our classic cappuccino",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 15, unit: "g" },
				{ ingredientId: "milk", quantity: 100, unit: "ml" },
				{ ingredientId: "ice", quantity: 1, unit: "cups" },
				{ ingredientId: "sugar", quantity: 5, unit: "g" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 20, unit: "g" },
				{ ingredientId: "milk", quantity: 150, unit: "ml" },
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" },
				{ ingredientId: "sugar", quantity: 8, unit: "g" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 25, unit: "g" },
				{ ingredientId: "milk", quantity: 200, unit: "ml" },
				{ ingredientId: "ice", quantity: 2, unit: "cups" },
				{ ingredientId: "sugar", quantity: 10, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 4,
		calories: {
			small: 75,
			medium: 110,
			large: 145
		}
	},
	{
		menu_id: "3",
		name: "Americano",
	image: AmericanoImg,
		type: "hot",
		status: "available",
		small_price: 100,
		medium_price: 200,
		large_price: 300,
		description: "Strong black coffee with hot water",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 18, unit: "g" },
				{ ingredientId: "sugar", quantity: 3, unit: "g" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 25, unit: "g" },
				{ ingredientId: "sugar", quantity: 5, unit: "g" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 32, unit: "g" },
				{ ingredientId: "sugar", quantity: 7, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 2,
		calories: {
			small: 5,
			medium: 8,
			large: 12
		}
	},
	{
		menu_id: "4",
		name: "Mocha",
	image: MochaImg,
		type: "hot",
		status: "unavailable",
		small_price: 100,
		medium_price: 200,
		large_price: 300,
		description: "Rich chocolate coffee with steamed milk",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 15, unit: "g" },
				{ ingredientId: "chocolate-syrup", quantity: 20, unit: "ml" },
				{ ingredientId: "milk", quantity: 120, unit: "ml" },
				{ ingredientId: "cocoa-powder", quantity: 3, unit: "g" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 20, unit: "g" },
				{ ingredientId: "chocolate-syrup", quantity: 30, unit: "ml" },
				{ ingredientId: "milk", quantity: 180, unit: "ml" },
				{ ingredientId: "cocoa-powder", quantity: 5, unit: "g" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 25, unit: "g" },
				{ ingredientId: "chocolate-syrup", quantity: 40, unit: "ml" },
				{ ingredientId: "milk", quantity: 240, unit: "ml" },
				{ ingredientId: "cocoa-powder", quantity: 7, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 4,
		calories: {
			small: 150,
			medium: 220,
			large: 290
		}
	},
	{
		menu_id: "5",
		name: "Vanilla Latte",
	image: VanillaLatteImg,
		type: "milk-tea",
		status: "available",
		small_price: 100,
		medium_price: 200,
		large_price: 300,
		description: "Smooth latte with vanilla flavoring",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 12, unit: "g" },
				{ ingredientId: "vanilla-syrup", quantity: 15, unit: "ml" },
				{ ingredientId: "milk", quantity: 150, unit: "ml" },
				{ ingredientId: "sugar", quantity: 5, unit: "g" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 18, unit: "g" },
				{ ingredientId: "vanilla-syrup", quantity: 25, unit: "ml" },
				{ ingredientId: "milk", quantity: 220, unit: "ml" },
				{ ingredientId: "sugar", quantity: 8, unit: "g" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 24, unit: "g" },
				{ ingredientId: "vanilla-syrup", quantity: 35, unit: "ml" },
				{ ingredientId: "milk", quantity: 290, unit: "ml" },
				{ ingredientId: "sugar", quantity: 10, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 3,
		calories: {
			small: 120,
			medium: 180,
			large: 240
		}
	},
	{
		menu_id: "6",
		name: "Caramel Frappe",
	image: CaramelFrappeImg,
		type: "frappe",
		status: "available",
		small_price: 120,
		medium_price: 220,
		large_price: 320,
		description: "Blended ice drink with caramel flavoring",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 10, unit: "g" },
				{ ingredientId: "caramel-syrup", quantity: 20, unit: "ml" },
				{ ingredientId: "milk", quantity: 100, unit: "ml" },
				{ ingredientId: "ice", quantity: 1, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 15, unit: "ml" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 15, unit: "g" },
				{ ingredientId: "caramel-syrup", quantity: 30, unit: "ml" },
				{ ingredientId: "milk", quantity: 150, unit: "ml" },
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 25, unit: "ml" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 20, unit: "g" },
				{ ingredientId: "caramel-syrup", quantity: 40, unit: "ml" },
				{ ingredientId: "milk", quantity: 200, unit: "ml" },
				{ ingredientId: "ice", quantity: 2, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 35, unit: "ml" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 5,
		calories: {
			small: 200,
			medium: 300,
			large: 400
		}
	},
	{
		menu_id: "7",
		name: "Strawberry Soda",
	image: StrawberrySodaImg,
		type: "soda",
		status: "available",
		small_price: 90,
		medium_price: 180,
		large_price: 270,
		description: "Refreshing strawberry flavored soda",
		ingredients: {
			small: [
				{ ingredientId: "strawberry-syrup", quantity: 30, unit: "ml" },
				{ ingredientId: "ice", quantity: 1, unit: "cups" },
				{ ingredientId: "sugar", quantity: 8, unit: "g" }
			],
			medium: [
				{ ingredientId: "strawberry-syrup", quantity: 45, unit: "ml" },
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" },
				{ ingredientId: "sugar", quantity: 12, unit: "g" }
			],
			large: [
				{ ingredientId: "strawberry-syrup", quantity: 60, unit: "ml" },
				{ ingredientId: "ice", quantity: 2, unit: "cups" },
				{ ingredientId: "sugar", quantity: 16, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 2,
		calories: {
			small: 120,
			medium: 180,
			large: 240
		}
	},
	{
		menu_id: "8",
		name: "Matcha Milk Tea",
	image: MatchaMilkTeaImg,
		type: "milk-tea",
		status: "unavailable",
		small_price: 110,
		medium_price: 210,
		large_price: 310,
		description: "Traditional Japanese green tea with milk",
		ingredients: {
			small: [
				{ ingredientId: "matcha-powder", quantity: 5, unit: "g" },
				{ ingredientId: "milk", quantity: 120, unit: "ml" },
				{ ingredientId: "sugar", quantity: 8, unit: "g" },
				{ ingredientId: "ice", quantity: 0.5, unit: "cups" }
			],
			medium: [
				{ ingredientId: "matcha-powder", quantity: 8, unit: "g" },
				{ ingredientId: "milk", quantity: 180, unit: "ml" },
				{ ingredientId: "sugar", quantity: 12, unit: "g" },
				{ ingredientId: "ice", quantity: 1, unit: "cups" }
			],
			large: [
				{ ingredientId: "matcha-powder", quantity: 12, unit: "g" },
				{ ingredientId: "milk", quantity: 240, unit: "ml" },
				{ ingredientId: "sugar", quantity: 16, unit: "g" },
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 4,
		calories: {
			small: 80,
			medium: 120,
			large: 160
		}
	},
	{
		menu_id: "9",
		name: "Hazelnut Frappe",
	image: HazelnutFrappeImg,
		type: "frappe",
		status: "available",
		small_price: 130,
		medium_price: 230,
		large_price: 330,
		description: "Rich hazelnut flavored blended drink",
		ingredients: {
			small: [
				{ ingredientId: "coffee-beans", quantity: 10, unit: "g" },
				{ ingredientId: "hazelnut-syrup", quantity: 25, unit: "ml" },
				{ ingredientId: "milk", quantity: 100, unit: "ml" },
				{ ingredientId: "ice", quantity: 1, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 15, unit: "ml" }
			],
			medium: [
				{ ingredientId: "coffee-beans", quantity: 15, unit: "g" },
				{ ingredientId: "hazelnut-syrup", quantity: 35, unit: "ml" },
				{ ingredientId: "milk", quantity: 150, unit: "ml" },
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 25, unit: "ml" }
			],
			large: [
				{ ingredientId: "coffee-beans", quantity: 20, unit: "g" },
				{ ingredientId: "hazelnut-syrup", quantity: 45, unit: "ml" },
				{ ingredientId: "milk", quantity: 200, unit: "ml" },
				{ ingredientId: "ice", quantity: 2, unit: "cups" },
				{ ingredientId: "whipped-cream", quantity: 35, unit: "ml" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 5,
		calories: {
			small: 220,
			medium: 320,
			large: 420
		}
	},
	{
		menu_id: "10",
		name: "Classic Soda",
	image: ClassicSodaImg,
		type: "soda",
		status: "available",
		small_price: 80,
		medium_price: 160,
		large_price: 240,
		description: "Classic carbonated soda drink",
		ingredients: {
			small: [
				{ ingredientId: "ice", quantity: 1, unit: "cups" },
				{ ingredientId: "sugar", quantity: 10, unit: "g" }
			],
			medium: [
				{ ingredientId: "ice", quantity: 1.5, unit: "cups" },
				{ ingredientId: "sugar", quantity: 15, unit: "g" }
			],
			large: [
				{ ingredientId: "ice", quantity: 2, unit: "cups" },
				{ ingredientId: "sugar", quantity: 20, unit: "g" }
			]
		},
		cups: {
			small: "cup-sm",
			medium: "cup-md",
			large: "cup-lg"
		},
		prepTime: 1,
		calories: {
			small: 100,
			medium: 150,
			large: 200
		}
	}
];
