// AddonManagementModal.tsx
import React, { useState } from "react";
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField, { Input } from "../ui/FormField";
import { addonData } from "../../mocks/addonData";

interface AddonItem {
	id: string;
	name: string;
	price: number;
	category: 'syrup' | 'sauce' | 'topping' | 'extra' | 'milk';
	description?: string;
	available: boolean;
}

interface AddonManagementModalProps {
  open: boolean;
  onClose: () => void;
}

const AddonManagementModal: React.FC<AddonManagementModalProps> = ({ open, onClose }) => {
  const [addons, setAddons] = useState<AddonItem[]>(addonData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const categories = ['all', 'syrup', 'sauce', 'topping', 'extra', 'milk'];

  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || addon.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (addon: AddonItem) => {
    setEditingAddon({ ...addon });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingAddon({
      id: "",
      name: "",
      price: 0,
      category: "syrup",
      description: "",
      available: true
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (!editingAddon) return;

    if (isAddingNew) {
      const newAddon = {
        ...editingAddon,
        id: `addon-${Date.now()}`
      };
      setAddons(prev => [...prev, newAddon]);
    } else {
      setAddons(prev => prev.map(addon => 
        addon.id === editingAddon.id ? editingAddon : addon
      ));
    }
    
    setEditingAddon(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    setAddons(prev => prev.filter(addon => addon.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    setAddons(prev => prev.map(addon => 
      addon.id === id ? { ...addon, available: !addon.available } : addon
    ));
  };

  const formatPrice = (price: number) => `₱${price}`;

  const getCategoryColor = (category: string) => {
    const colors = {
      syrup: "bg-blue-100 text-blue-800",
      sauce: "bg-purple-100 text-purple-800",
      topping: "bg-green-100 text-green-800",
      extra: "bg-orange-100 text-orange-800",
      milk: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const mainContent = (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <FormField label="Search Addons">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="pl-10"
              />
            </div>
          </FormField>
        </div>
        <div className="w-48">
          <FormField label="Category">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* Add New Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} icon={Plus}>
          Add New Addon
        </Button>
      </div>

      {/* Addons List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredAddons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No addons found matching your criteria.
          </div>
        ) : (
          filteredAddons.map(addon => (
            <div key={addon.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{addon.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(addon.category)}`}>
                    {addon.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    addon.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {addon.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {addon.description && (
                  <p className="text-sm text-gray-600 mb-1">{addon.description}</p>
                )}
                <p className="text-lg font-bold text-[#776B5D]">{formatPrice(addon.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(addon)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleAvailability(addon.id)}
                >
                  {addon.available ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(addon.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const editForm = editingAddon && (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isAddingNew ? 'Add New Addon' : 'Edit Addon'}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Name" required>
          <Input
            value={editingAddon.name}
            onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })}
            placeholder="Enter addon name"
          />
        </FormField>
        
        <FormField label="Category" required>
          <select
            value={editingAddon.category}
            onChange={(e) => setEditingAddon({ ...editingAddon, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
          >
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price" required>
          <Input
            type="number"
            value={editingAddon.price}
            onChange={(e) => setEditingAddon({ ...editingAddon, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </FormField>
        
        <FormField label="Status">
          <select
            value={editingAddon.available ? 'available' : 'unavailable'}
            onChange={(e) => setEditingAddon({ ...editingAddon, available: e.target.value === 'available' })}
            className="w-full px-3 py-2 border border-[#B0A695] rounded-lg focus:ring-2 focus:ring-[#776B5D] focus:border-transparent appearance-none bg-white text-[#776B5D]"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </FormField>
      </div>

      <FormField label="Description">
        <Input
          value={editingAddon.description || ''}
          onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })}
          placeholder="Enter addon description (optional)"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={() => setEditingAddon(null)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isAddingNew ? 'Add Addon' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const footer = !editingAddon ? (
    <Button onClick={onClose}>
      Close
    </Button>
  ) : null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Addon Management"
      size="lg"
      footer={footer}
    >
      {editingAddon ? editForm : mainContent}
    </Modal>
  );
};

export default AddonManagementModal;
