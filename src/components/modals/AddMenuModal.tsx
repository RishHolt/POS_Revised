// AddMenuModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, UploadCloud } from 'lucide-react';
import { cupsList, ingredientsList } from '../../mocks/ingredientsData';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormField, { Input, Select } from '../ui/FormField';

// Mock data for dropdowns - in a real app, this would come from an API
const categories = [
    { id: 1, name: 'Hot Coffee' },
    { id: 2, name: 'Iced Coffee' },
    { id: 3, name: 'Pastries' },
    { id: 4, name: 'Non-Coffee' },
];

// Define types for our state
type MenuIngredient = {
    id: string;
    ingredientId: string;
    quantity: string;
};

type MenuCup = {
    cupId: string;
    price: string;
}

interface AddMenuModalProps {
    open: boolean;
    onClose: () => void;
    onNext: () => void;
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({ open, onClose, onNext }) => {
    // --- STATE MANAGEMENT ---
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<'available' | 'unavailable'>('available');
    const [sizes, setSizes] = useState({ small: true, medium: false, large: false });

    // State for cups per size
    const [smallCup, setSmallCup] = useState<MenuCup>({ cupId: '', price: '' });
    const [mediumCup, setMediumCup] = useState<MenuCup>({ cupId: '', price: '' });
    const [largeCup, setLargeCup] = useState<MenuCup>({ cupId: '', price: '' });

    // State for ingredients per size
    const [smallIngredients, setSmallIngredients] = useState<MenuIngredient[]>([]);
    const [mediumIngredients, setMediumIngredients] = useState<MenuIngredient[]>([]);
    const [largeIngredients, setLargeIngredients] = useState<MenuIngredient[]>([]);

    // --- FORM RESET LOGIC ---
    const resetForm = useCallback(() => {
        setImagePreview(null);
        setName('');
        setCategory('');
        setStatus('available');
        setSizes({ small: true, medium: false, large: false });
        setSmallCup({ cupId: '', price: '' });
        setMediumCup({ cupId: '', price: '' });
        setLargeCup({ cupId: '', price: '' });
        setSmallIngredients([]);
        setMediumIngredients([]);
        setLargeIngredients([]);
    }, []);

    // Effect to reset form when modal is closed/opened
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, resetForm]);

    // --- EVENT HANDLERS ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSizeChange = (size: keyof typeof sizes) => {
        setSizes(prev => ({ ...prev, [size]: !prev[size] }));
    };

    const handleAddIngredient = (size: 'small' | 'medium' | 'large') => {
        const newIngredient: MenuIngredient = {
            id: `ing-${Date.now()}`,
            ingredientId: '',
            quantity: '',
        };
        if (size === 'small') setSmallIngredients(prev => [...prev, newIngredient]);
        if (size === 'medium') setMediumIngredients(prev => [...prev, newIngredient]);
        if (size === 'large') setLargeIngredients(prev => [...prev, newIngredient]);
    };

    const handleIngredientChange = (
        size: 'small' | 'medium' | 'large',
        index: number,
        field: 'ingredientId' | 'quantity',
        value: string
    ) => {
        const setter = {
            small: setSmallIngredients,
            medium: setMediumIngredients,
            large: setLargeIngredients,
        }[size];

        setter(prev =>
            prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
        );
    };

    
    // A reusable component for size-specific sections (Cups & Ingredients)
    const SizeSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-[#B0A695]/10 mt-4 p-4 border border-[#B0A695]/30 rounded-lg">
            <h4 className="mb-3 font-semibold text-[#776B5D]">{title}</h4>
            {children}
        </div>
    );

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button onClick={onNext}>
                Next
            </Button>
        </>
    );
    
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Add Menu"
            size="lg"
            footer={footer}
        >
            <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center items-center">
                        <label htmlFor="image-upload" className="w-40 h-40 cursor-pointer">
                            <div className="flex flex-col justify-center items-center hover:bg-[#B0A695]/10 border-[#B0A695] border-2 hover:border-[#776B5D] border-dashed rounded-full w-full h-full text-[#776B5D]/60 transition-colors">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Menu item" className="rounded-full w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <UploadCloud size={40} />
                                        <span className="mt-2 text-sm text-center">Upload Image</span>
                                    </>
                                )}
                            </div>
                        </label>
                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>

                {/* Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Name" required>
                        <Input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g., Cappuccino" 
                        />
                    </FormField>
                    <FormField label="Category" required>
                        <Select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                            placeholder="Select Category"
                        />
                    </FormField>
                </div>

                    {/* Sizes & Status */}
                    <div className="items-center gap-6 grid grid-cols-1 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 font-medium text-[#776B5D] text-sm">Sizes</label>
                            <div className="flex gap-4">
                                {(['small', 'medium', 'large'] as const).map(size => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={sizes[size]} onChange={() => handleSizeChange(size)} className="rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]" />
                                        <span className="text-[#776B5D] capitalize">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block mb-2 font-medium text-[#776B5D] text-sm">Status</label>
                            <div className="flex gap-4">
                               <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={status === 'available'} onChange={() => setStatus('available')} className="rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]" />
                                    <span className="text-[#776B5D]">Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={status === 'unavailable'} onChange={() => setStatus('unavailable')} className="rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]" />
                                    <span className="text-[#776B5D]">Unavailable</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cups Section */}
                    <div>
                        <h3 className="mb-2 font-semibold text-[#776B5D] text-lg">Cups & Pricing</h3>
                        {sizes.small && (
                            <SizeSection title="Small">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={smallCup.cupId} 
                                        onChange={(e) => setSmallCup(prev => ({ ...prev, cupId: e.target.value }))} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={smallCup.price} 
                                        onChange={(e) => setSmallCup(prev => ({...prev, price: e.target.value }))} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </SizeSection>
                        )}
                         {sizes.medium && (
                            <SizeSection title="Medium">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={mediumCup.cupId} 
                                        onChange={(e) => setMediumCup(prev => ({...prev, cupId: e.target.value}))} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={mediumCup.price} 
                                        onChange={(e) => setMediumCup(prev => ({...prev, price: e.target.value}))} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </SizeSection>
                        )}
                         {sizes.large && (
                            <SizeSection title="Large">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={largeCup.cupId} 
                                        onChange={(e) => setLargeCup(prev => ({...prev, cupId: e.target.value}))} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={largeCup.price} 
                                        onChange={(e) => setLargeCup(prev => ({...prev, price: e.target.value}))} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </SizeSection>
                        )}
                    </div>
                    
                    {/* Ingredients Section */}
                    <div>
                        <h3 className="mb-2 font-semibold text-[#776B5D] text-lg">Ingredients</h3>
                        {sizes.small && (
                            <SizeSection title="Small">
                                {smallIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={(e) => handleIngredientChange('small', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={(e) => handleIngredientChange('small', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 30ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button onClick={() => handleAddIngredient('small')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </SizeSection>
                        )}
                        {sizes.medium && (
                            <SizeSection title="Medium">
                                {mediumIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={(e) => handleIngredientChange('medium', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                             <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={(e) => handleIngredientChange('medium', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 45ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button onClick={() => handleAddIngredient('medium')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </SizeSection>
                        )}
                         {sizes.large && (
                            <SizeSection title="Large">
                               {largeIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={(e) => handleIngredientChange('large', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={(e) => handleIngredientChange('large', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 60ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button onClick={() => handleAddIngredient('large')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </SizeSection>
                        )}
                    </div>
            </div>
        </Modal>
    );
};

export default AddMenuModal;