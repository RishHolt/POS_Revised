import React, { useState, useEffect } from 'react';
import { Package, User, Hash, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormField, { Input, Select, Textarea } from '../ui/FormField';

interface AddInventoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (inventoryItem: InventoryItem) => void;
	editingItem?: InventoryItem | null;
}

interface InventoryItem {
	id: string;
	name: string;
	category: string;
	supplier: string;
	unit: string;
	quantityPerPack: string;
	currentStock: number;
	packagePrice: number;
	reorderLevel: number;
	isCups: boolean;
	isIngredient: boolean;
	description: string;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose, onSave, editingItem }) => {
	const [formData, setFormData] = useState({
		name: '',
		category: '',
		supplier: '',
		unit: '',
		quantityPerPack: '',
		currentStock: '',
		packagePrice: '',
		reorderLevel: '',
		isCups: false,
		isIngredient: false,
		description: ''
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const categories = [
		'Liquid',
		'Solid', 
		'Powder',
		'Syrup',
		'Disposable',
		'Dairy',
		'Other'
	];

	const units = [
		'ml',
		'g',
		'kg',
		'L',
		'cups',
		'pieces',
		'boxes',
		'packs'
	];

	useEffect(() => {
		if (editingItem) {
			setFormData({
				name: editingItem.name,
				category: editingItem.category,
				supplier: editingItem.supplier,
				unit: editingItem.unit,
				quantityPerPack: editingItem.quantityPerPack,
				currentStock: editingItem.currentStock.toString(),
				packagePrice: editingItem.packagePrice.toString(),
				reorderLevel: editingItem.reorderLevel.toString(),
				isCups: editingItem.isCups,
				isIngredient: editingItem.isIngredient,
				description: editingItem.description
			});
		} else {
			setFormData({
				name: '',
				category: '',
				supplier: '',
				unit: '',
				quantityPerPack: '',
				currentStock: '',
				packagePrice: '',
				reorderLevel: '',
				isCups: false,
				isIngredient: false,
				description: ''
			});
		}
		setErrors({});
	}, [editingItem, isOpen]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Product name is required';
		}

		if (!formData.category) {
			newErrors.category = 'Category is required';
		}

		if (!formData.supplier.trim()) {
			newErrors.supplier = 'Supplier is required';
		}

		if (!formData.unit) {
			newErrors.unit = 'Unit is required';
		}

		if (!formData.quantityPerPack.trim()) {
			newErrors.quantityPerPack = 'Quantity per pack is required';
		}

		if (!formData.currentStock.trim()) {
			newErrors.currentStock = 'Current stock is required';
		} else if (isNaN(Number(formData.currentStock)) || Number(formData.currentStock) < 0) {
			newErrors.currentStock = 'Current stock must be a valid number';
		}

		if (!formData.packagePrice.trim()) {
			newErrors.packagePrice = 'Package price is required';
		} else if (isNaN(Number(formData.packagePrice)) || Number(formData.packagePrice) < 0) {
			newErrors.packagePrice = 'Package price must be a valid number';
		}

		if (!formData.reorderLevel.trim()) {
			newErrors.reorderLevel = 'Reorder level is required';
		} else if (isNaN(Number(formData.reorderLevel)) || Number(formData.reorderLevel) < 0) {
			newErrors.reorderLevel = 'Reorder level must be a valid number';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		const inventoryItem: InventoryItem = {
			id: editingItem?.id || `INV${Date.now()}`,
			name: formData.name,
			category: formData.category,
			supplier: formData.supplier,
			unit: formData.unit,
			quantityPerPack: formData.quantityPerPack,
			currentStock: Number(formData.currentStock),
			packagePrice: Number(formData.packagePrice),
			reorderLevel: Number(formData.reorderLevel),
			isCups: formData.isCups,
			isIngredient: formData.isIngredient,
			description: formData.description
		};

		onSave(inventoryItem);
		onClose();
	};

	const footer = (
		<>
			<Button variant="secondary" onClick={onClose}>
				Close
			</Button>
			<Button onClick={() => handleSubmit({} as React.FormEvent)}>
				{editingItem ? 'Update Inventory' : 'Add Inventory'}
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
			size="xl"
			footer={footer}
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Two Column Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column */}
					<div className="space-y-4">
						{/* Product Name */}
						<FormField label="Product Name" required error={errors.name}>
							<Input
								type="text"
								value={formData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder="Product Name..."
								icon={Package}
								error={!!errors.name}
							/>
						</FormField>

						{/* Category */}
						<FormField label="Category" required error={errors.category}>
							<Select
								value={formData.category}
								onChange={(e) => handleInputChange('category', e.target.value)}
								options={categories.map(cat => ({ value: cat, label: cat }))}
								placeholder="Select Category"
								icon={Package}
								error={!!errors.category}
							/>
						</FormField>

						{/* Quantity per Pack */}
						<FormField label="Quantity per Pack" required error={errors.quantityPerPack}>
							<Input
								type="text"
								value={formData.quantityPerPack}
								onChange={(e) => handleInputChange('quantityPerPack', e.target.value)}
								placeholder="ex: 500ml"
								icon={Hash}
								error={!!errors.quantityPerPack}
							/>
						</FormField>

						{/* Current Stock */}
						<FormField label="Current Stock" required error={errors.currentStock}>
							<Input
								type="number"
								value={formData.currentStock}
								onChange={(e) => handleInputChange('currentStock', e.target.value)}
								placeholder="Current Stock..."
								icon={Hash}
								error={!!errors.currentStock}
							/>
						</FormField>
					</div>

					{/* Right Column */}
					<div className="space-y-4">
						{/* Supplier */}
						<FormField label="Supplier" required error={errors.supplier}>
							<Input
								type="text"
								value={formData.supplier}
								onChange={(e) => handleInputChange('supplier', e.target.value)}
								placeholder="Supplier name.."
								icon={User}
								error={!!errors.supplier}
							/>
						</FormField>

						{/* Unit */}
						<FormField label="Unit" required error={errors.unit}>
							<Select
								value={formData.unit}
								onChange={(e) => handleInputChange('unit', e.target.value)}
								options={units.map(unit => ({ value: unit, label: unit }))}
								placeholder="Select Unit"
								icon={Hash}
								error={!!errors.unit}
							/>
						</FormField>

						{/* Package Price */}
						<FormField label="Package Price" required error={errors.packagePrice}>
							<Input
								type="number"
								value={formData.packagePrice}
								onChange={(e) => handleInputChange('packagePrice', e.target.value)}
								placeholder="ex: 50"
								icon={DollarSign}
								error={!!errors.packagePrice}
							/>
						</FormField>

						{/* Reorder Level */}
						<FormField label="Reorder Level" required error={errors.reorderLevel}>
							<Input
								type="number"
								value={formData.reorderLevel}
								onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
								placeholder="Low Stock Alert..."
								icon={AlertTriangle}
								error={!!errors.reorderLevel}
							/>
						</FormField>
					</div>
				</div>

				{/* Checkboxes */}
				<div className="flex gap-6">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.isCups}
							onChange={(e) => handleInputChange('isCups', e.target.checked)}
							className="mr-2 text-[#776B5D] focus:ring-[#776B5D] rounded"
						/>
						<span className="text-[#776B5D]">Is cups?</span>
					</label>
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.isIngredient}
							onChange={(e) => handleInputChange('isIngredient', e.target.checked)}
							className="mr-2 text-[#776B5D] focus:ring-[#776B5D] rounded"
						/>
						<span className="text-[#776B5D]">Is ingredient?</span>
					</label>
				</div>

				{/* Description */}
				<FormField label="Description">
					<Textarea
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						placeholder="Description..."
						icon={FileText}
					/>
				</FormField>
			</form>
		</Modal>
	);
};

export default AddInventoryModal;
