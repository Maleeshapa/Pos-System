import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Form from '../../Models/Form/Form';
import Modal from 'react-modal';
import Table from '../Table/Table'

const NewRental = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [data,] = useState([
    ['1', "MaleeshaPa", "5", '1'],
  ]);
  const Columns = ["id", 'product', 'qty', 'price'];

  return (
    <div>
      <div className="scrolling-container">
        <h4>Rental Invoice</h4>
        <form action="" className='customer-form' >
          <div className="sales-add-form">
            <div className="customer">
              <div className="subCaption">
                <p>Customer Details</p>
                <button className='addCusBtn' type="button" onClick={openModal}><PlusCircle size={30} /></button>
              </div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Customer Form"
              >
                <Form closeModal={closeModal} />
              </Modal>

              <div className="customer-details">
                <label htmlFor="">Customer Name</label>
                <input type="text" className="form-control" name="cusName" id="cusName" placeholder="Enter Name" />
              </div>
              <div className="customer-details">
                <label htmlFor="">Reference No</label>
                <input type="text" className="form-control" name="refNo" id="refNo" placeholder="Enter No" />
              </div>
            </div>

            <div className="product">
              <div className="subCaption">
                <p>Product Details</p>
              </div>
              <div className="row">
                <div className="product-details col-md-4 mb-2">
                  <input type="text" name="productNo" className="form-control" id="productNo" placeholder="Product No" />
                </div>
                <div className="product-details col-md-8 mb-2">
                  <input type="text" name="productName" className="form-control" id="productName" placeholder="Product Name" />
                </div>
                <div className="product-details col-md-4 mb-2">
                  <label htmlFor="">Selling Price</label>
                  <input type="number" name="price" className="form-control" id="price" placeholder="Selling Price" onWheel={(e) => e.target.blur()} />
                </div>
                <div className="product-details col-md-4 mb-2">
                  <label htmlFor="">Rental Date</label>
                  <input type="datetime-local" name="rentalDate" className="form-control" id="rentalDate" />
                </div>
                <div className="product-details col-md-4 mb-2">
                  <label htmlFor="">Total Price</label>
                  <input type="number" onWheel={(e) => e.target.blur()} name="totalPrice" className="form-control" id="totalPrice" placeholder="Total Price" />
                </div>
                <div className="product-details col-md-6 mb-2">
                  <textarea name="note" className="form-control" id="note" placeholder="Note and Warranty" rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="sales-addbtn d-grid d-md-flex me-md-2 justify-content-end px-5">
            <button className="btn btn-primary btn-md">Add Product</button>
          </div>
        </form>

        <div className="product-table">
          <Table
            data={data}
            columns={Columns}
            showSearch={false}
            showButton={false}
            showActions={false}
            showRow={false}
            showDate={false}
            showPDF={false}
          />

        </div>

        <form action="" className='payment-form'>

          <div className="payment-form-group">
            <div className="sales-person-box">
              <div className="sales-person">
                <label id='label'>Sales Person</label>
                <select className="form-control">
                  <option value="" >Select</option>
                  <option value="1" >Admin</option>
                  <option value="2" >User</option>
                </select>
              </div>
              <div className="sales-person">
                <label htmlFor="" id='label'>Invoice Date</label>
                <input type="datetime-local" className="form-control" name="invoiceDate" id="invoiceDate" />
              </div>
            </div>

            <div className="amount-box">
              <div className="amount-group">
                <label htmlFor="" id='label'>Total Amount</label>
                <input type="number" className="form-control" name="totalAmount" onWheel={(e) => e.target.blur()} id="readOnly" readOnly />
              </div>
              <div className="amount-group">
                <label htmlFor="" id='label'>Advance Payment</label>
                <input type="number" className="form-control" name="advance" onWheel={(e) => e.target.blur()} id="advance" />
              </div>
              <div className="amount-group">
                <label htmlFor="" id='label'>Invoice Note</label>
                <textarea name="invoiceNote" className="form-control" id="invoiceNote" rows={3} />
              </div>
            </div>
          </div>

          <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
            <button className='btn btn-danger btn-md mb-2' >Cancel</button>
            <button className='btn btn-primary btn-md mb-2'>Create invoice</button>
          </div>
        </form>
      </div>
    </div>

  )
}

export default NewRental