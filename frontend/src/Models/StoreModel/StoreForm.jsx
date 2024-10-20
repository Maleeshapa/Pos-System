import React, { useState, useEffect } from 'react';
import '../StaffModel/StaffModal.css';
import config from '../../config';

const StoreForm = ({ closeModal, showModal, onSave, store }) => {
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
    });

    useEffect(() => {
        if (showModal && store) {
            setFormData({
                name: store.storeName,
                address: store.storeAddress,
            });
        } else if (!showModal) {
            setFormData({
                name: '',
                address: '',
            });
            setFormErrors({});
            setError(null);
        }
    }, [showModal, store]);

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
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

        const storeData = {
            storeName: formData.name,
            storeAddress: formData.address,
        };

        try {
            const response = await fetch(`${config.BASE_URL}/store${store ? `/${store.storeId}` : ''}`, {
                method: store ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An error occurred.');
            } else {
                setSuccessMessage(store ? 'Store updated successfully!' : 'Store created successfully!');
                closeModal();
                onSave();
            }
        } catch (err) {
            setError('Failed to save store. Please try again.');
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
                    <h4>{store ? 'Update Department' : 'Add Department'}</h4>
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
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Store Name</label>
                            <input type="text" value={formData.name} onChange={handleChange} name="name" id="name" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Store Address</label>
                            <input type="text" value={formData.address} onChange={handleChange} name="address" id="address" className="form-control" />
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

export default StoreForm;
