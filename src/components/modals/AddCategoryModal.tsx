// AddCategoryModal.tsx
import React, { useState } from "react";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingCategory) {
        handleSaveEdit();
      } else {
        handleSubmit();
      }
    }
  };

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
            onKeyPress={handleKeyPress}
          />
        </FormField>
        
        {name.trim() && categories.includes(name.trim()) && (
          <p className="text-red-500 text-xs mt-1">Category already exists</p>
        )}
        
        <div>
          <h3 className="mb-3 font-semibold text-[#776B5D] text-sm">Existing Categories ({categories.length})</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">📂</div>
                <p className="text-sm">No categories yet. Add your first category above!</p>
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat} className="flex items-center justify-between bg-white px-3 py-2 border border-[#B0A695] rounded-lg group hover:shadow-sm transition-shadow">
                  {editingCategory === cat ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Check}
                        onClick={handleSaveEdit}
                        disabled={!editName.trim() || editName.trim() === cat}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={X}
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#776B5D] rounded-full"></div>
                        <span className="text-[#776B5D] font-medium">{cat}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEdit(cat)}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onRemove(cat)}
                        />
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