import React, { useState, useEffect } from 'react';
import './StaffModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import config from '../../config';

const StaffModal = ({ showModal, closeModal, onSave, staff }) => {
  const [image, setImage] = useState(null);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '-Select Title-',
    fullName: '',
    userType: '-Select Title-',
    userName: '',
    email: '',
    password: '',
    nic: '',
    address: '',
    contact1: '',
    contact2: '',
    department: '',
    photo: ''
  });

  
    const resetForm = () => {
      setFormData({
        title: '-Select Title-',
        fullName: '',
        userType: '-Select Title-',
        userName: '',
        email: '',
        password: '',
        nic: '',
        address: '',
        contact1: '',
        contact2: '',
        department: '',
        photo: ''
      });
      setImage(null);
      setFormErrors({});
    };
  
    
    useEffect(() => {
      if (!showModal) {
        resetForm();
      }
    }, [showModal]);

  useEffect(() => {
    if (staff) {
      setFormData({
        title: staff.title || '-Select Title-',
        fullName: staff.fullName || '',
        userType: staff.userType || '-Select Type-',
        userName: staff.userName || '',
        email: staff.email || '',
        password: '',
        nic: staff.nic || '',
        address: staff.address || '',
        contact1: staff.contact1 || '',
        contact2: staff.contact2 || '',
        department: staff.department || '',
        photo: staff.photo || ''
      });
    }
  }, [staff]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/stores`);
        if (response.ok) {
          const data = await response.json();
          setStores(data);
        } else {
          console.error('Failed to fetch stores');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStore();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (formData.title === '-Select Title-') {
      newErrors.title = 'Please select a valid title.';
    }
    if (formData.userType === '-Select Type-') {
      newErrors.userType = 'Please select a valid user type.';
    }
    if (!formData.department || formData.department === 'select') {
      newErrors.department = 'Please select a valid department.';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const formDataToSend = new FormData();

      // Append form data
      formDataToSend.append('userTitle', formData.title);
      formDataToSend.append('userFullName', formData.fullName);
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('userPassword', formData.password);
      formDataToSend.append('userType', formData.userType);
      formDataToSend.append('userEmail', formData.email);
      formDataToSend.append('userNIC', formData.nic);
      formDataToSend.append('userTP', formData.contact1);
      formDataToSend.append('userSecondTP', formData.contact2 || null);
      formDataToSend.append('userAddress', formData.address);
      formDataToSend.append('storeId', formData.department);

      // Append image if exists
      if (image) {
        formDataToSend.append('userImage', image);
      }

      const response = await fetch(`${config.BASE_URL}/user${staff ? `/${staff.userId}` : ''}`, {
        method: staff ? 'PUT' : 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setError(staff ? 'Successfully Updated!' : 'Successfully Created!');
        onSave();
        closeModal();
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while saving the customer.');
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevFormData) => ({ ...prevFormData, photo: reader.result }));
      setImage(file);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };


  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{staff ? 'Edit User' : 'New User'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="photo-container">
              <img
                src={formData.photo || 'https://via.placeholder.com/150'}
                alt="User"
                className="user-photo"
              />
              <div className="edit-icon">
                <label htmlFor="photo-input">
                  <FontAwesomeIcon icon={faEdit} />
                </label>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>

          <div className="form-flex">
            <div className="form-1">
            <div className="form-group">
                <label>Department / Job Position</label>
                <select name="department" id=""
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="select">Select Department</option>
                  {stores.map((store) => (
                    <option key={store.storeId} value={store.storeId}>
                      {store.storeName}
                    </option>
                  ))}
                </select>
                {formErrors.department && <div className="error-message">{formErrors.department}</div>}
              </div>
              <div className="form-group">
                <label>Title <span>*</span></label>
                <select name="title" value={formData.title} onChange={handleChange} required>
                  <option value="select">-select title-</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
                {formErrors.title && <div className="error-message">{formErrors.title}</div>}
              </div>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>User Name <span>*</span></label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter User Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email <span>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                />
              </div>
            </div>

            <div className="form-1">
              <div className="form-group-name">
                <label>User Type <span>*</span></label>
                <select name="userType" value={formData.userType} onChange={handleChange} required>
                  <option value="select">-Select Type-</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                {formErrors.userType && <div className="error-message">{formErrors.userType}</div>}
              </div>
              <div className="form-group">
                <label>Contact 1</label>
                <input
                  type="text"
                  name="contact1"
                  value={formData.contact1}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact 2</label>
                <input
                  type="text"
                  name="contact2"
                  value={formData.contact2}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mt-4">
                <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
                <button type="submit" className="btn btn-primary">{staff ? 'Update' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
