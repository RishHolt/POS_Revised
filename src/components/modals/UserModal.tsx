import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { userRoles } from '../../mocks/userData';
// import { getUserPermissions } from '../../mocks/userData'; // Temporarily commented out for testing
import type { User as UserType } from '../../mocks/userData';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormField, { Input, Select } from '../ui/FormField';

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (user: Omit<UserType, 'id' | 'lastLogin'>) => void;
	editingUser?: UserType | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, editingUser }) => {
	const [formData, setFormData] = useState({
		username: '',
		firstName: '',
		lastName: '',
		email: '',
		role: 'barista' as 'admin' | 'cashier' | 'barista',
		status: 'active' as 'active' | 'inactive',
		phone: '',
		hireDate: new Date().toISOString().split('T')[0]
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (editingUser) {
			setFormData({
				username: editingUser.username,
				firstName: editingUser.firstName,
				lastName: editingUser.lastName,
				email: editingUser.email,
				role: editingUser.role,
				status: editingUser.status,
				phone: editingUser.phone || '',
				hireDate: editingUser.hireDate.toISOString().split('T')[0]
			});
		} else {
			setFormData({
				username: '',
				firstName: '',
				lastName: '',
				email: '',
				role: 'barista',
				status: 'active',
				phone: '',
				hireDate: new Date().toISOString().split('T')[0]
			});
		}
		setErrors({});
	}, [editingUser, isOpen]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.username.trim()) {
			newErrors.username = 'Username is required';
		}

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
		}

		if (!formData.hireDate) {
			newErrors.hireDate = 'Hire date is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		const userData = {
			...formData,
			phone: formData.phone || undefined,
			hireDate: new Date(formData.hireDate)
			// permissions: getUserPermissions(formData.role) // Temporarily removed for testing
		};

		onSave(userData);
		onClose();
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	const footer = (
		<>
			<Button variant="secondary" onClick={onClose}>
				Cancel
			</Button>
			<Button type="submit">
				{editingUser ? 'Update User' : 'Add User'}
			</Button>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editingUser ? 'Edit User' : 'Add New User'}
			size="md"
			footer={footer}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormField label="Username" required error={errors.username}>
					<Input
						type="text"
						value={formData.username}
						onChange={(e) => handleInputChange('username', e.target.value)}
						placeholder="Enter username"
						icon={User}
						error={!!errors.username}
					/>
				</FormField>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="First Name" required error={errors.firstName}>
						<Input
							type="text"
							value={formData.firstName}
							onChange={(e) => handleInputChange('firstName', e.target.value)}
							placeholder="Enter first name"
							icon={User}
							error={!!errors.firstName}
						/>
					</FormField>

					<FormField label="Last Name" required error={errors.lastName}>
						<Input
							type="text"
							value={formData.lastName}
							onChange={(e) => handleInputChange('lastName', e.target.value)}
							placeholder="Enter last name"
							icon={User}
							error={!!errors.lastName}
						/>
					</FormField>
				</div>

				<FormField label="Email" required error={errors.email}>
					<Input
						type="email"
						value={formData.email}
						onChange={(e) => handleInputChange('email', e.target.value)}
						placeholder="Enter email address"
						icon={Mail}
						error={!!errors.email}
					/>
				</FormField>

				<FormField label="Phone Number">
					<Input
						type="tel"
						value={formData.phone}
						onChange={(e) => handleInputChange('phone', e.target.value)}
						placeholder="Enter phone number"
						icon={Phone}
					/>
				</FormField>

				<FormField label="Role" required>
					<Select
						value={formData.role}
						onChange={(e) => handleInputChange('role', e.target.value)}
						options={userRoles.map(role => ({ value: role.value, label: role.label }))}
						icon={Shield}
					/>
				</FormField>

				<FormField label="Status" required>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								value="active"
								checked={formData.status === 'active'}
								onChange={(e) => handleInputChange('status', e.target.value)}
								className="mr-2 text-[#776B5D] focus:ring-[#776B5D]"
							/>
							<span className="text-[#776B5D]">Active</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								value="inactive"
								checked={formData.status === 'inactive'}
								onChange={(e) => handleInputChange('status', e.target.value)}
								className="mr-2 text-[#776B5D] focus:ring-[#776B5D]"
							/>
							<span className="text-[#776B5D]">Inactive</span>
						</label>
					</div>
				</FormField>

				<FormField label="Hire Date" required error={errors.hireDate}>
					<Input
						type="date"
						value={formData.hireDate}
						onChange={(e) => handleInputChange('hireDate', e.target.value)}
						icon={Calendar}
						error={!!errors.hireDate}
					/>
				</FormField>
			</form>
		</Modal>
	);
};

export default UserModal;
