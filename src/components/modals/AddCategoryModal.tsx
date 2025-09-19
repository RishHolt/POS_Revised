// AddCategoryModal.tsx
import React, { useState } from "react";
import { Trash2, Edit, Check, X } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FormField, { Input } from "../ui/FormField";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  categories: string[];
  onRemove: (name: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onConfirm, categories, onRemove }) => {
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = () => {
    if (name.trim() && !categories.includes(name.trim())) {
      onConfirm(name.trim());
      setName("");
    }
  };

  const handleEdit = (category: string) => {
    setEditingCategory(category);
    setEditName(category);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName.trim() !== editingCategory) {
      // Here you would typically update the category in your data
      // For now, we'll just close the edit mode
      console.log(`Renamed "${editingCategory}" to "${editName.trim()}"`);
    }
    setEditingCategory(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
  };

  // Removed unused handleKeyPress function

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button onClick={handleSubmit} disabled={!name.trim() || categories.includes(name.trim())}>
        Add Category
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Menu Categories"
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        <FormField label="Add New Category" required>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter category name"
          />
        </FormField>
        
        {name.trim() && categories.includes(name.trim()) && (
          <p className="mt-1 text-red-500 text-xs">Category already exists</p>
        )}
        
        <div>
          <h3 className="mb-3 font-semibold text-[#776B5D] text-sm">Existing Categories ({categories.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="bg-gray-50 py-8 rounded-lg text-gray-500 text-center">
                <div className="mb-2 text-4xl">📂</div>
                <p className="text-sm">No categories yet. Add your first category above!</p>
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat} className="group flex justify-between items-center bg-white hover:shadow-sm px-3 py-2 border border-[#B0A695] rounded-lg transition-shadow">
                  {editingCategory === cat ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Check}
                        onClick={handleSaveEdit}
                        disabled={!editName.trim() || editName.trim() === cat}
                      >
                        {""}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={X}
                        onClick={handleCancelEdit}
                      >
                        {""}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="bg-[#776B5D] rounded-full w-2 h-2"></div>
                        <span className="font-medium text-[#776B5D]">{cat}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEdit(cat)}
                        >
                          {""}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onRemove(cat)}
                        >
                          {""}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;