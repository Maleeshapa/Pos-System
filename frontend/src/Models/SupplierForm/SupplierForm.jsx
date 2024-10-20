import React, { useState, useEffect } from 'react';
import '../StaffModel/StaffModal.css';
import config from '../../config';

const SupplierForm = ({ closeModal, showModal, onSave, supplier }) => {
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        nic: '',
        contact1: '',
        contact2: ''
    });

    useEffect(() => {
        if (showModal && supplier) {
            setFormData({
                name: supplier.supplierName,
                address: supplier.supplierAddress,
                email: supplier.supplierEmail,
                nic: supplier.supplierNic,
                contact1: supplier.supplierTP,
                contact2: supplier.supplierSecondTP,
            });
        } else if (!showModal) {
            setFormData({
                name: '',
                address: '',
                email: '',
                nic: '',
                contact1: '',
                contact2: ''
            });
            setFormErrors({});
            setError(null);
        }
    }, [showModal, supplier]);

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Supplier name is required';
        }
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        }
        if (!formData.nic.trim()) {
            errors.nic = 'NIC is required';
        }
        if (!formData.contact1.trim()) {
            errors.contact1 = 'At least one contact number is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const supplierData = {
            supplierName: formData.name,
            supplierAddress: formData.address,
            supplierEmail: formData.email,
            supplierNic: formData.nic,
            supplierTP: formData.contact1,
            supplierSecondTP: formData.contact2,
        };

        try {
            const response = await fetch(`${config.BASE_URL}/supplier${supplier ? `/${supplier.supplierId}` : ''}`, {
                method: supplier ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An error occurred.');
            } else {
                setSuccessMessage(supplier ? 'Supplier updated successfully!' : 'Supplier created successfully!');
                closeModal();
                onSave();
            }
        } catch (err) {
            setError('Failed to save supplier. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    if (!showModal) return null;

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h4>{supplier ? 'Update Supplier' : 'Add Supplier'}</h4>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Supplier Name</label>
                            <input type="text" value={formData.name} onChange={handleChange} name="name" id="name" className="form-control" />
                            {formErrors.name && <p className="error">{formErrors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Supplier Address</label>
                            <input type="text" value={formData.address} onChange={handleChange} name="address" id="address" className="form-control" />
                            {formErrors.address && <p className="error">{formErrors.address}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={formData.email} onChange={handleChange} name="email" id="email" className="form-control" />
                            {formErrors.email && <p className="error">{formErrors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="nic">NIC</label>
                            <input type="text" value={formData.nic} onChange={handleChange} name="nic" id="nic" className="form-control" />
                            {formErrors.nic && <p className="error">{formErrors.nic}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact1">Contact 1</label>
                            <input type="text" value={formData.contact1} onChange={handleChange} name="contact1" id="contact1" className="form-control" />
                            {formErrors.contact1 && <p className="error">{formErrors.contact1}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact2">Contact 2</label>
                            <input type="text" value={formData.contact2} onChange={handleChange} name="contact2" id="contact2" className="form-control" />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SupplierForm;
