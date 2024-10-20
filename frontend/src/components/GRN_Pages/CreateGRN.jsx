import React, { useState } from 'react'
import './GRN.css'

const CreateGRN = () => {
  const [formData, setFormData] = useState({
    store: '',
    GRN_Date: '',
    refno: '',
    supplier: '',
    cashAmount: '',
    chequeAmount: '',
    due: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
  }

  const [iamge, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <div className="scrolling-container">
        <h4>CreateGRN</h4>
        <div className="row">
          <form action="" className='col-md-4' onSubmit={handleSubmit}>
            <div className="row">
              <div className="grn-details col-md-10 mb-3">
                <label htmlFor="">Store</label>
                <select name="store" value={formData.store} id="" className='form-control' onChange={handleChange} >
                  <option value="Main">Main</option>
                  <option value="Sub">sub</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="grn-details col-md-5 mb-3">
                <label htmlFor="">GRN Date</label>
                <input type="datetime-local" name='GRN_Date' value={formData.GRN_Date} className='form-control' onChange={handleChange} />
              </div>
              <div className="grn-details col-md-5 mb-3">
                <label htmlFor="">REF NO.</label>
                <input type="text" name='refno' value={formData.refno} className='form-control' onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="grn-details col-md-5 mb-3">
                <label htmlFor="">Supplier</label>
                <select name="supplier" value={formData.supplier} id="" className='form-control' onChange={handleChange} >
                  <option value="Main">Main</option>
                  <option value="Sub">sub</option>
                </select>
              </div>
              <div className="grn-details col-md-5 mb-3">
                <label htmlFor="">Received</label>
                <select name="store" value={formData.store} id="" className='form-control' onChange={handleChange} >
                  <option value="Main">Main</option>
                  <option value="Sub">sub</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="grn-details col-md-5 mb-3">
              <label htmlFor="">Cash Amount</label>
              <input type="number" name='cashAmount' value={formData.cashAmount} className='form-control' onChange={handleChange} />
            </div>
            <div className="grn-details col-md-5 mb-3">
              <label htmlFor="">Cheque Amount</label>
              <input type="text" name='chequeAmount' value={formData.chequeAmount} className='form-control' onChange={handleChange} />
            </div>
            </div>
            <div className="row">
              <div className="grn-details col-md-10 mb-3">
              <label htmlFor="">Due</label>
              <input type="text" name='due' value={formData.due} className='form-control' onChange={handleChange} id='readOnly' readOnly />
            </div>
            <div className="grn-details col-md-10 mb-3">
              <label htmlFor="">Bill Image</label>
              <input type="file" name='image' accept='image/*' className='form-control' onChange={handleImageChange}  />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Bill Image" width="300px" height="auto" />
                </div>
              )}
            </div>
            </div>
            

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateGRN