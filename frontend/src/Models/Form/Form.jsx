import React, { useState, useEffect } from 'react';
import './Form.css';
import config from '../../config';

const Form = ({ closeModal, onSave, cus }) => {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Mr.',
    name: '',
    phone: '',
    email: '',
    nic: '',
    address: '',
    company: '',
    jobPosition: '',
    workplacePhone: '',
    workplaceAddress: ''
  });

  // UseEffect to populate the form with customer data if editing
  useEffect(() => {
    if (cus) {
      setFormData({
        title: cus.cusTitle || 'Mr.',
        name: cus.cusName || '',
        phone: cus.cusPhone || '',
        email: cus.cusEmail || '',
        nic: cus.cusNIC || '',
        address: cus.cusAddress || '',
        company: cus.cusCompany || '',
        jobPosition: cus.cusJob || '',
        workplacePhone: cus.cusWorkPlaceTP || '',
        workplaceAddress: cus.cusWorkPlaceAddress || '',
      });
    }
  }, [cus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove error message when user starts correcting the input
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Validation function
  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits.';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Email is invalid.';
    }

    if (formData.nic && !/^(\d{9}[VvXx]|\d{12})$/.test(formData.nic.trim())) {
      errors.nic = 'NIC format is invalid.';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required.';
    }

    if (formData.workplacePhone && !/^\d{10}$/.test(formData.workplacePhone.trim())) {
      errors.workplacePhone = 'Workplace phone must be 10 digits.';
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

    const customerData = {
      cusTitle: formData.title,
      cusName: formData.name,
      cusAddress: formData.address,
      cusPhone: formData.phone,
      cusEmail: formData.email,
      cusNIC: formData.nic,
      cusCompany: formData.company,
      cusJob: formData.jobPosition,
      cusWorkPlaceTP: formData.workplacePhone,
      cusWorkPlaceAddress: formData.workplaceAddress,
      cusCode: generateCustomerCode(formData.name),
      cusCity: 'Unknown',
    };

    console.log('Customer data:', customerData);

    try {
      const url = cus
        ? `${config.BASE_URL}/customer/${cus.cusId}`
        : `${config.BASE_URL}/customer`;
      const method = cus ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      console.log('Response status:', response.status);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log(cus ? 'Customer updated:' : 'Customer created:', responseData);
        setError(cus ? 'Successfully Updated!' : 'Successfully Created!');
        onSave(customerData);
        closeModal();
      } else {
        console.error('Failed to save customer:', responseData);
        setError(responseData.error || 'An error occurred while saving the customer.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while saving the customer.');
    }
  };

  const generateCustomerCode = (name) => {
    return name.substring(0, 3).toUpperCase() + Date.now().toString().slice(-4);
  };

  return (
    <div>
      <h2>{cus ? 'Edit Customer' : 'New Customer'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group-1">
          <div className="form-group-name-flex">
            <div className="form-group-name">
              <label>Title <span>*</span></label>
              <select name="title" value={formData.title} onChange={handleChange} required>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
            <div className="form-group-name">
              <label htmlFor="name">Name <span>*</span></label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                required
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && <span id="name-error" className="error-text">{formErrors.name}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone <span>*</span></label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone"
              required
              aria-describedby={formErrors.phone ? 'phone-error' : undefined}
            />
            {formErrors.phone && <span id="phone-error" className="error-text">{formErrors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
            {formErrors.email && <span id="email-error" className="error-text">{formErrors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="nic">NIC</label>
            <input
              id="nic"
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter NIC"
              aria-describedby={formErrors.nic ? 'nic-error' : undefined}
            />
            {formErrors.nic && <span id="nic-error" className="error-text">{formErrors.nic}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Address <span>*</span></label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
              aria-describedby={formErrors.address ? 'address-error' : undefined}
            />
            {formErrors.address && <span id="address-error" className="error-text">{formErrors.address}</span>}
          </div>
        </div>
        <div className="form-group-2">
          <div className="form-group">
            <label>Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Enter Workplace" />
          </div>
          <div className="form-group">
            <label>Job Position</label>
            <input type="text" name="jobPosition" value={formData.jobPosition} onChange={handleChange} placeholder="Enter Job Position" />
          </div>
          <div className="form-group">
            <label>Workplace Phone</label>
            <input
              type="text"
              name="workplacePhone"
              value={formData.workplacePhone}
              onChange={handleChange}
              placeholder="Enter Office Phone"
              aria-describedby={formErrors.workplacePhone ? 'workplacePhone-error' : undefined}
            />
            {formErrors.workplacePhone && <span id="workplacePhone-error" className="error-text">{formErrors.workplacePhone}</span>}
          </div>
          <div className="form-group">
            <label>Workplace Address</label>
            <input type="text" name="workplaceAddress" value={formData.workplaceAddress} onChange={handleChange} placeholder="Workplace Address" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={closeModal}>Close</button>
            <button type="submit">{cus ? 'Update' : 'Save Changes'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
