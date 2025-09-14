import React, { useState } from "react";
import { X, User, Phone, Mail, Star } from "lucide-react";
import Button from "../ui/Button";
import FormField, { Input } from "../ui/FormField";

interface JoinLoyaltyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (customerData: {
        name: string;
        phone: string;
        email: string;
    }) => void;
}

const JoinLoyaltyModal: React.FC<JoinLoyaltyModalProps> = ({ isOpen, onClose, onJoin }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: ""
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onJoin(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({ name: "", phone: "", email: "" });
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="p-6 border-b border-[#B0A695]/20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-[#776B5D]" />
                            <h3 className="font-semibold text-[#776B5D] text-xl">Join Loyalty Program</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-[#776B5D]/70 hover:text-[#776B5D] text-2xl"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-[#776B5D]/70 mt-2">
                        Join our loyalty program to earn points and unlock exclusive rewards!
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <FormField label="Full Name" error={errors.name}>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                icon={User}
                                error={!!errors.name}
                            />
                        </FormField>

                        <FormField label="Phone Number" error={errors.phone}>
                            <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="Enter your phone number"
                                icon={Phone}
                                error={!!errors.phone}
                            />
                        </FormField>

                        <FormField label="Email Address" error={errors.email}>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter your email address"
                                icon={Mail}
                                error={!!errors.email}
                            />
                        </FormField>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                        >
                            Join Program
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinLoyaltyModal;
