import React, { useState, useEffect } from 'react';
import config from '../../config';

const CategoryForm = ({ closeModal, showModal, selectedCategory, onSave }) => {
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryType: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showModal && selectedCategory) {
            setFormData({
                categoryName: selectedCategory.categoryName || '',
                categoryType: selectedCategory.categoryType || ''
            });
        } else if (!showModal) {
            setFormData({
                categoryName: '',
                categoryType: ''
            });
            setError(null);
        }
    }, [showModal,selectedCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            categoryType: formData.categoryType ? formData.categoryType : null
        };

        try {
            const response = await fetch(`${config.BASE_URL}/category${selectedCategory ? `/${selectedCategory.categoryId}` : ''}`, {
                method: selectedCategory ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                setError(selectedCategory ? 'Successfully Updated!' : 'Successfully Created!');
                onSave();
                closeModal();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to save category');
            }
        } catch (error) {
            setError('An error occurred.');
        }
    };

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{selectedCategory ? 'Edit Category' : 'Add Category'}</h4>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryName">Category Name</label>
                        <input
                            type="text"
                            name="categoryName"
                            id="categoryName"
                            className="form-control"
                            value={formData.categoryName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryType">Category Type</label>
                        <input
                            type="text"
                            name="categoryType"
                            id="categoryType"
                            className="form-control"
                            value={formData.categoryType}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
                        <button type="submit" className="btn btn-primary">{selectedCategory ? 'Update' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
