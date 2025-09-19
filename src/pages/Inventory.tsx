import React, { useState } from "react";
import { Package, AlertTriangle, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { ingredientsList, cupsList } from "../mocks/ingredientsData";
import AddInventoryModal from "../components/modals/AddInventoryModal";
import PageHeader from "../components/ui/PageHeader";
import SearchAndFilters from "../components/ui/SearchAndFilters";
import Button from "../components/ui/Button";
import { TableContainer, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/Table";

const Inventory: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCategory, setFilterCategory] = useState<string>('all');
	const [selectedProduct, setSelectedProduct] = useState('');
	const [currentStock, setCurrentStock] = useState('');
	const [inputStock, setInputStock] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<any>(null);

	// Combine all items for unified display
	const allItems = [
		...ingredientsList.map(ing => ({
			...ing,
			type: 'ingredient' as const,
			supplier: 'SM',
			pkgPrice: (ing.cost * 100).toFixed(0), // Convert to package price
			qtyPerPack: 100,
			unitCost: ing.cost.toFixed(2)
		})),
		...cupsList.map(cup => ({
			...cup,
			type: 'cup' as const,
			supplier: 'SM',
			pkgPrice: (cup.cost * 10).toFixed(0), // Convert to package price
			qtyPerPack: 10,
			unitCost: cup.cost.toFixed(2),
			category: 'disposable' as const,
			minStock: 50 // Add minStock for cups
		}))
	];

	const filteredItems = allItems.filter(item => {
		const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
		return matchesSearch && matchesCategory;
	});

	const lowStockItems = filteredItems.filter(item => item.stock <= item.minStock);
	const lowStockCount = lowStockItems.length;

	const getStockStatus = (stock: number, minStock: number) => {
		if (stock <= 0) return { status: 'out', color: 'text-red-500' };
		if (stock <= minStock) return { status: 'low', color: 'text-red-500' };
		return { status: 'good', color: 'text-[#776B5D]' };
	};

	const categories = [
		{ label: 'All Items', value: 'all', icon: Package },
		{ label: 'Disposable', value: 'disposable', icon: Package },
		{ label: 'Dairy', value: 'liquid', icon: Package },
		{ label: 'Solid', value: 'solid', icon: Package },
		{ label: 'Powder', value: 'powder', icon: Package },
		{ label: 'Syrup', value: 'syrup', icon: Package }
	];

	const handleAddInventory = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleEditInventory = (item: any) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleSaveInventory = (inventoryItem: any) => {
		// In a real app, this would save to a database
		console.log('Saving inventory item:', inventoryItem);
		// For now, just close the modal
		setIsModalOpen(false);
	};

	const handleRestock = () => {
		if (selectedProduct && inputStock) {
			// In a real app, this would update the database
			console.log(`Restocking ${selectedProduct} with ${inputStock} ${allItems.find(item => item.id === selectedProduct)?.unit}`);
			setSelectedProduct('');
			setCurrentStock('');
			setInputStock('');
		}
	};

	const actions = (
		<>
			<Button onClick={handleAddInventory} icon={Plus}>
				Add Inventory
			</Button>
			<Button icon={Plus}>
				Add Category
			</Button>
		</>
	);

	const statusTags = (
		<>
			<span className="flex items-center gap-1 bg-orange-100 px-3 py-2 border border-orange-300 rounded-lg font-medium text-orange-600">
				<AlertTriangle className="w-4 h-4" />
				Low Stock
			</span>
			<span className="bg-white px-3 py-2 border border-green-500 rounded-lg font-medium text-green-600">In Stock</span>
			<span className="bg-white px-3 py-2 border border-red-500 rounded-lg font-medium text-red-500">Out of Stock</span>
		</>
	);

	return (
		<div className="bg-[#F3EEEA] p-4 sm:p-6 lg:p-8 h-full overflow-hidden flex flex-col">
			<PageHeader
				title="Inventory Management"
				description="Track and manage your coffee shop's inventory, ingredients, and supplies"
				actions={actions}
			/>

			{/* Restock Controls - separate section */}
			<div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
				<div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4">
					<span className="font-medium text-[#776B5D] text-sm sm:text-base">Restock:</span>
					<select
						value={selectedProduct}
						onChange={(e) => {
							setSelectedProduct(e.target.value);
							const item = allItems.find(item => item.id === e.target.value);
							setCurrentStock(item ? `${item.stock} ${item.unit}` : '');
						}}
						className="bg-white px-3 py-2 border border-[#B0A695] rounded-lg text-[#776B5D] min-w-[120px] sm:min-w-[150px] text-sm"
					>
						<option value="">Select Product</option>
						{allItems.map(item => (
							<option key={item.id} value={item.id}>{item.name}</option>
						))}
					</select>
					<span className="font-medium text-[#776B5D] text-sm sm:text-base">Current Stock:</span>
					<input
						type="text"
						value={currentStock}
						placeholder="Ex: 300 ml"
						className="px-3 py-2 border border-[#B0A695] rounded-lg text-[#776B5D] min-w-[100px] sm:min-w-[120px] text-sm"
						readOnly
					/>
					<input
						type="number"
						value={inputStock}
						onChange={(e) => setInputStock(e.target.value)}
						placeholder="input stock"
						className="px-3 py-2 border border-[#B0A695] rounded-lg text-[#776B5D] min-w-[100px] sm:min-w-[120px] text-sm"
					/>
					<button
						onClick={handleRestock}
						className="bg-[#776B5D] hover:bg-[#776B5D]/90 px-3 sm:px-4 py-2 rounded-lg font-medium text-[#F3EEEA] transition-colors duration-150 text-sm"
					>
						Confirm
					</button>
				</div>
			</div>

			{/* Category Tabs - matching Menu.tsx exactly */}
			<div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
				{lowStockCount > 0 && (
					<div className="flex justify-center items-center bg-red-500 p-2 rounded-xl">
						<button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md font-normal transition-colors duration-150 w-full h-full bg-transparent text-white text-sm sm:text-base">
							<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="hidden sm:inline">Low on stock | {lowStockCount}</span>
							<span className="sm:hidden">Low Stock ({lowStockCount})</span>
						</button>
					</div>
				)}
				{categories.map(category => (
					<button
						key={category.value}
						onClick={() => setFilterCategory(category.value)}
						className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-normal transition-colors duration-150 text-sm sm:text-base whitespace-nowrap ${
							filterCategory === category.value 
								? "bg-[#776B5D] text-[#F3EEEA] shadow-sm" 
								: "bg-white text-[#776B5D] hover:bg-[#B0A695]/10 border border-[#B0A695]/20"
						}`}
					>
						{React.createElement(category.icon, { 
							className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", 
							color: filterCategory === category.value ? "#F3EEEA" : "#776B5D" 
						})}
						<span className="hidden sm:inline">{category.label}</span>
						<span className="sm:hidden">{category.label.split(' ')[0]}</span>
					</button>
				))}
			</div>

			<SearchAndFilters
				searchValue={searchTerm}
				onSearchChange={setSearchTerm}
				statusTags={statusTags}
			/>

			{/* Inventory Table */}
			<TableContainer scrollable className="flex-1 flex flex-col">
				<TableHeader sticky>
					<tr>
						<TableCell header>
							<div className="flex items-center gap-1">
								ID <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Name <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Category <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Supplier <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Pkg Price <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Qty per Pack <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Unit <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Unit Cost <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								On stock <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>
							<div className="flex items-center gap-1">
								Reorder level <ArrowUpDown className="w-3 h-3" />
							</div>
						</TableCell>
						<TableCell header>Actions</TableCell>
					</tr>
				</TableHeader>
				<TableBody>
					{filteredItems.map((item, index) => {
						const stockStatus = getStockStatus(item.stock, item.minStock);
						return (
							<TableRow key={item.id} alternating index={index}>
								<TableCell className="font-medium">
									{item.type === 'ingredient' ? `INV${item.id.slice(-3).toUpperCase()}` : `CUP${item.id.slice(-3).toUpperCase()}`}
								</TableCell>
								<TableCell className="font-medium">{item.name}</TableCell>
								<TableCell className="capitalize">{item.category}</TableCell>
								<TableCell>{item.supplier}</TableCell>
								<TableCell>₱{item.pkgPrice}</TableCell>
								<TableCell>{item.qtyPerPack}</TableCell>
								<TableCell>{item.unit}</TableCell>
								<TableCell>₱{item.unitCost}</TableCell>
								<TableCell className={`font-medium ${stockStatus.color}`}>
									{item.stock}
								</TableCell>
								<TableCell className={`font-medium ${stockStatus.color}`}>
									{item.minStock}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<button 
											onClick={() => handleEditInventory(item)}
											className="p-1 hover:bg-[#B0A695]/20 rounded transition-colors"
										>
											<Edit className="w-4 h-4 text-[#776B5D]" />
										</button>
										<button className="p-1 hover:bg-red-100 rounded transition-colors">
											<Trash2 className="w-4 h-4 text-red-500" />
										</button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</TableContainer>

			{/* Add Inventory Modal */}
			<AddInventoryModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveInventory}
				editingItem={editingItem}
			/>
		</div>
	);
};

export default Inventory;
