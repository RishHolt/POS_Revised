import React, { useState } from "react";
import { Clipboard, Plus, Star } from "lucide-react";
import AddMenuModal from "../components/modals/AddMenuModal";
import AddAddonModal from "../components/modals/AddAddonModal";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import EditMenuModal from "../components/modals/EditMenuModal";
import { menuData, Category } from "../mocks/menuData";
import PageHeader from "../components/ui/PageHeader";
import SearchAndFilters from "../components/ui/SearchAndFilters";
import Button from "../components/ui/Button";


// --- MAIN MENU COMPONENT ---
const Menu = () => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addonModalOpen, setAddonModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    // Category state for AddCategoryModal
    const [categories, setCategories] = useState<string[]>([...Category.map(c => c.label)]);

    const filteredMenu = menuData.filter(item => {
        const matchesFilter = activeFilter === "all" || item.type === activeFilter;
        const matchesSearch = searchTerm.trim() === "" || (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase()) || item.status.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const formatPrice = (price: number | undefined) => price ? `₱${price}` : "N/A";
    const handleEditItem = (item: any) => {
        setSelectedItem(item);
        setEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        // TODO: update menuData with updated item
        setEditModalOpen(false);
    };

    const handleDeleteFromModal = (itemId: string | number) => {
        console.log(`Delete item: ${itemId}`);
        setEditModalOpen(false);
    };

    // Add new category
    const handleAddCategory = (name: string) => {
        if (name && !categories.includes(name)) {
            setCategories(prev => [...prev, name]);
        }
    };
    // Remove category
    const handleRemoveCategory = (name: string) => {
        setCategories(prev => prev.filter(cat => cat !== name));
    };

    const actions = (
        <>
            <Button onClick={() => setMenuModalOpen(true)} icon={Plus}>
                Add Menu
            </Button>
            <Button onClick={() => setAddonModalOpen(true)} icon={Plus}>
                Add Addons
            </Button>
            {/* <Button onClick={() => setmealModalOpen(true)} icon={Plus}>
                Add Meals
            </Button> */}
            <Button onClick={() => setCategoryModalOpen(true)} icon={Plus}>
                Add Category
            </Button>
        </>
    );

    const statusTags = (
        <>
            <span className="flex items-center gap-1 bg-orange-100 px-3 py-2 border border-orange-300 rounded-lg font-medium text-orange-600">
                <Star className="w-4 h-4" /> Best Seller
            </span>
            <span className="bg-white px-3 py-2 border border-green-500 rounded-lg font-medium text-green-600">Available</span>
            <span className="bg-white px-3 py-2 border border-red-500 rounded-lg font-medium text-red-500">Unavailable</span>
        </>
    );

    return (
        <div className="bg-[#F3EEEA] p-8 h-full">
            <PageHeader
                title="Menu Management"
                description="Manage your coffee shop menu items, categories, and pricing"
                actions={actions}
            />

            <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                {Category.map(c => (
                    <div key={c.value} className="flex justify-center items-center bg-white p-2 rounded-xl">
                        <button onClick={() => setActiveFilter(c.value)} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-normal transition-colors duration-150 w-full h-full ${activeFilter === c.value ? "bg-[#776B5D] text-[#F3EEEA]" : "bg-transparent text-[#776B5D]"}`}>
                            {React.createElement(c.icon, { className: "w-5 h-5", color: activeFilter === c.value ? "#F3EEEA" : "#776B5D" })}
                            <span>{c.label}</span>
                        </button>
                    </div>
                ))}
            </div>

            <SearchAndFilters
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                statusTags={statusTags}
            />

            <div className="gap-6 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 pr-6 pb-[20px] w-full max-h-[60vh] overflow-y-auto custom-scrollbar">
                {filteredMenu.map(item => (
                    <div key={item.menu_id} className={`flex flex-col items-start bg-white p-4 border rounded-xl transition duration-300 cursor-pointer hover:shadow-xl group border-[#B0A695] ${item.status === 'available' ? 'hover:border-[#776B5D]' : 'opacity-50 grayscale'}`}
                        onClick={() => handleEditItem(item)}>
                        <div className="relative w-full">
                            <img src={item.image} alt={item.name} className="mb-3 rounded-lg w-full object-cover aspect-square" />
                        </div>
                        <div className="mb-4 w-full font-bold text-[#776B5D] text-xl truncate">{item.name}</div>
                        <div className={`mb-2 text-sm capitalize font-medium ${item.type === 'hot' ? 'text-red-500' : item.type === 'cold' ? 'text-blue-500' : 'text-[#776B5D]/70'}`}>{item.type.replace('-', ' ')}</div>
                        <div className="flex flex-wrap gap-2 mb-3 font-medium text-sm">
                            {item.small_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">S {formatPrice(item.small_price)}</span>)}
                            {item.medium_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">M {formatPrice(item.medium_price)}</span>)}
                            {item.large_price && (<span className="bg-[#B0A695]/20 px-2 py-1 rounded-lg text-[#776B5D]">L {formatPrice(item.large_price)}</span>)}
                        </div>
                        <div className="flex justify-between mt-auto w-full">
                            <div className={`font-medium text-sm ${item.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMenu.length === 0 && (
                <div className="flex flex-col justify-center items-center py-16 text-center">
                    <Clipboard className="mb-4 w-16 h-16 text-[#776B5D]/30" />
                    <h3 className="mb-2 font-bold text-[#776B5D] text-lg">No menu items found</h3>
                    <p className="mb-6 text-[#776B5D]/60">Try adjusting your search terms or filters.</p>
                    <button onClick={() => setMenuModalOpen(true)} className="bg-[#776B5D] hover:bg-[#776B5D]/90 px-6 py-3 rounded-xl font-medium text-[#F3EEEA] transition-colors duration-150"><Plus className="inline mr-2 w-4 h-4" />Add Menu Item</button>
                </div>
            )}

            <AddMenuModal open={menuModalOpen} onClose={() => setMenuModalOpen(false)} onNext={() => { console.log("Form data would be submitted here"); setMenuModalOpen(false); }} />
            <AddAddonModal open={addonModalOpen} onClose={() => setAddonModalOpen(false)} onConfirm={() => setAddonModalOpen(false)} />
            <AddCategoryModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onConfirm={handleAddCategory}
                categories={categories}
                onRemove={handleRemoveCategory}
            />
            <EditMenuModal
                open={editModalOpen}
                item={selectedItem}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveEdit}
                onDelete={handleDeleteFromModal}
            />
        </div>
    );
};

export default Menu;

