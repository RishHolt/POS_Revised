// EditMenuModal.tsx
import React, { useState, useEffect } from "react";
import { UploadCloud, Plus } from "lucide-react";
import { Category } from "../../mocks/menuData";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField, { Input, Select } from "../ui/FormField";


type Ingredient = {
    id: string;
    ingredientId: string;
    quantity: string;
};

type Cup = {
    cupId: string;
    price: string;
};

import { cupsList, ingredientsList } from "../../mocks/ingredientsData";
import type { MenuItem } from "../../mocks/menuData";

interface EditMenuModalProps {
    open: boolean;
    item: MenuItem | null;
    onClose: () => void;
    onSave: (updated: MenuItem) => void;
    onDelete?: (id: string | number) => void;
}

const EditMenuModal: React.FC<EditMenuModalProps> = ({ open, item, onClose, onSave, onDelete }) => {
    const [form, setForm] = useState<MenuItem>(item || {
        menu_id: "",
        name: "",
        image: "",
        type: "hot",
        status: "available",
        small_price: 0,
        medium_price: 0,
        large_price: 0,
        description: "",
        ingredients: {
            small: [],
            medium: [],
            large: []
        },
        cups: {
            small: null,
            medium: null,
            large: null
        },
        prepTime: 0,
        calories: {
            small: null,
            medium: null,
            large: null
        }
    });
    const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);

    // Sizes state
    const [sizes, setSizes] = useState({ small: true, medium: false, large: false });
    // Cups state
    const [smallCup, setSmallCup] = useState<Cup>({ cupId: '', price: '' });
    const [mediumCup, setMediumCup] = useState<Cup>({ cupId: '', price: '' });
    const [largeCup, setLargeCup] = useState<Cup>({ cupId: '', price: '' });
    // Ingredients state
    const [smallIngredients, setSmallIngredients] = useState<Ingredient[]>([]);
    const [mediumIngredients, setMediumIngredients] = useState<Ingredient[]>([]);
    const [largeIngredients, setLargeIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        if (item) {
            setForm(item);
            setImagePreview(item.image || null);
            
            // Set sizes based on available prices
            setSizes({
                small: !!item.small_price,
                medium: !!item.medium_price,
                large: !!item.large_price
            });
            
            // Set cups from item data
            setSmallCup({
                cupId: item.cups.small || '',
                price: item.small_price ? item.small_price.toString() : ''
            });
            setMediumCup({
                cupId: item.cups.medium || '',
                price: item.medium_price ? item.medium_price.toString() : ''
            });
            setLargeCup({
                cupId: item.cups.large || '',
                price: item.large_price ? item.large_price.toString() : ''
            });
            
            // Set ingredients from item data
            setSmallIngredients(
                item.ingredients.small.map((ing, index) => ({
                    id: `ing-small-${index}`,
                    ingredientId: ing.ingredientId,
                    quantity: ing.quantity.toString()
                }))
            );
            setMediumIngredients(
                item.ingredients.medium.map((ing, index) => ({
                    id: `ing-medium-${index}`,
                    ingredientId: ing.ingredientId,
                    quantity: ing.quantity.toString()
                }))
            );
            setLargeIngredients(
                item.ingredients.large.map((ing, index) => ({
                    id: `ing-large-${index}`,
                    ingredientId: ing.ingredientId,
                    quantity: ing.quantity.toString()
                }))
            );
        }
    }, [item]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name.includes("price") ? Number(value) : value }));
    };

    const handleSizeChange = (size: keyof typeof sizes) => {
        setSizes(prev => ({ ...prev, [size]: !prev[size] }));
    };

    const handleCupChange = (size: 'small' | 'medium' | 'large', field: 'cupId' | 'price', value: string) => {
        if (size === 'small') setSmallCup(prev => ({ ...prev, [field]: value }));
        if (size === 'medium') setMediumCup(prev => ({ ...prev, [field]: value }));
        if (size === 'large') setLargeCup(prev => ({ ...prev, [field]: value }));
    };

    const handleAddIngredient = (size: 'small' | 'medium' | 'large') => {
        const newIngredient = {
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
        setter(prev => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update form with cups and ingredients data
        const updatedForm: MenuItem = {
            ...form,
            cups: {
                small: sizes.small ? smallCup.cupId : null,
                medium: sizes.medium ? mediumCup.cupId : null,
                large: sizes.large ? largeCup.cupId : null
            },
            ingredients: {
                small: smallIngredients.map(ing => ({
                    ingredientId: ing.ingredientId,
                    quantity: parseFloat(ing.quantity) || 0,
                    unit: ingredientsList.find(i => i.id === ing.ingredientId)?.unit || 'ml'
                })),
                medium: mediumIngredients.map(ing => ({
                    ingredientId: ing.ingredientId,
                    quantity: parseFloat(ing.quantity) || 0,
                    unit: ingredientsList.find(i => i.id === ing.ingredientId)?.unit || 'ml'
                })),
                large: largeIngredients.map(ing => ({
                    ingredientId: ing.ingredientId,
                    quantity: parseFloat(ing.quantity) || 0,
                    unit: ingredientsList.find(i => i.id === ing.ingredientId)?.unit || 'ml'
                }))
            },
            small_price: sizes.small ? parseFloat(smallCup.price) || null : null,
            medium_price: sizes.medium ? parseFloat(mediumCup.price) || null : null,
            large_price: sizes.large ? parseFloat(largeCup.price) || null : null
        };
        
        onSave(updatedForm);
    };

    // Reusable section for form layout
    const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-[#B0A695]/10 mt-4 p-4 border border-[#B0A695]/30 rounded-lg">
            <h4 className="mb-3 font-semibold text-[#776B5D]">{title}</h4>
            {children}
        </div>
    );

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            {onDelete && (
                <Button 
                    variant="danger" 
                    onClick={() => onDelete(form.menu_id)}
                >
                    Delete
                </Button>
            )}
            <Button type="submit">
                Save
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Edit Menu"
            size="lg"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center items-center">
                        <label htmlFor="edit-image-upload" className="w-40 h-40 cursor-pointer">
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
                        <input id="edit-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>

                {/* Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Name" required>
                        <Input 
                            type="text" 
                            value={form.name} 
                            onChange={(e) => handleChange(e)} 
                            placeholder="e.g., Cappuccino" 
                        />
                    </FormField>
                    <FormField label="Category" required>
                        <Select 
                            value={form.type} 
                            onChange={(e) => handleChange(e)} 
                            options={Category.map(c => ({ value: c.value, label: c.label }))}
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
                                    <input type="checkbox" checked={form.status === 'available'} onChange={() => setForm(prev => ({ ...prev, status: 'available' }))} className="rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]" />
                                    <span className="text-[#776B5D]">Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.status === 'unavailable'} onChange={() => setForm(prev => ({ ...prev, status: 'unavailable' }))} className="rounded focus:ring-[#776B5D] w-4 h-4 text-[#776B5D]" />
                                    <span className="text-[#776B5D]">Unavailable</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cups Section */}
                    <div>
                        <h3 className="mb-2 font-semibold text-[#776B5D] text-lg">Cups & Pricing</h3>
                        {sizes.small && (
                            <Section title="Small">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={smallCup.cupId} 
                                        onChange={e => handleCupChange('small', 'cupId', e.target.value)} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={smallCup.price} 
                                        onChange={e => handleCupChange('small', 'price', e.target.value)} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </Section>
                        )}
                        {sizes.medium && (
                            <Section title="Medium">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={mediumCup.cupId} 
                                        onChange={e => handleCupChange('medium', 'cupId', e.target.value)} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={mediumCup.price} 
                                        onChange={e => handleCupChange('medium', 'price', e.target.value)} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </Section>
                        )}
                        {sizes.large && (
                            <Section title="Large">
                                <div className="gap-4 grid grid-cols-2">
                                    <select 
                                        value={largeCup.cupId} 
                                        onChange={e => handleCupChange('large', 'cupId', e.target.value)} 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                    >
                                        <option value="">Select Cup</option>
                                        {cupsList.map(cup => <option key={cup.id} value={cup.id}>{cup.name}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={largeCup.price} 
                                        onChange={e => handleCupChange('large', 'price', e.target.value)} 
                                        placeholder="Price" 
                                        className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                    />
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Ingredients Section */}
                    <div>
                        <h3 className="mb-2 font-semibold text-[#776B5D] text-lg">Ingredients</h3>
                        {sizes.small && (
                            <Section title="Small">
                                {smallIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={e => handleIngredientChange('small', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={e => handleIngredientChange('small', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 30ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddIngredient('small')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </Section>
                        )}
                        {sizes.medium && (
                            <Section title="Medium">
                                {mediumIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={e => handleIngredientChange('medium', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={e => handleIngredientChange('medium', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 45ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddIngredient('medium')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </Section>
                        )}
                        {sizes.large && (
                            <Section title="Large">
                                {largeIngredients.map((ing, index) => (
                                    <div key={ing.id} className="gap-4 grid grid-cols-2 mb-2">
                                        <select 
                                            value={ing.ingredientId} 
                                            onChange={e => handleIngredientChange('large', index, 'ingredientId', e.target.value)} 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredientsList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                        <input 
                                            type="text" 
                                            value={ing.quantity} 
                                            onChange={e => handleIngredientChange('large', index, 'quantity', e.target.value)} 
                                            placeholder="Quantity (e.g., 60ml)" 
                                            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent text-[#776B5D]" 
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddIngredient('large')} className="flex items-center gap-1 mt-2 font-semibold text-[#776B5D] hover:text-[#776B5D]/80 text-sm transition-colors">
                                    <Plus size={16} /> Add Ingredient
                                </button>
                            </Section>
                        )}
                    </div>

            </form>
        </Modal>
    );
};

export default EditMenuModal;