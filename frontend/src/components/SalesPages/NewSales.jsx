  import React, { useState, useEffect } from 'react';
  import { PlusCircle, ShoppingCart, User } from 'lucide-react';
  import './NewSales.css';
  import Form from '../../Models/Form/Form';
  import Modal from 'react-modal';
  import Table from '../Table/Table'
  import config from '../../config';

  const NewSales = ({ invoice }) => {

    const [tableData, setTableData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [customerCreated, setCustomerCreated] = useState(false);
    const [users, setUsers] = useState([]);
    const [cusId, setCusId] = useState('');
    const [productId, setProductId] = useState('');
    const [stockId, setStockId] = useState('');

    const Columns = ["Customer Code", 'Customer Name', 'Customer Nic','Product Code', 'Product Name', 'Product Price', 'Quantity', 'Discount', 'Total Price', 'Warranty','Product ID','Stock ID'];
    const [formData, setFormData] = useState({
      cusName: '',
      cusNic: '',
      cusCode: '',
      productNo: '',
      productName: '',
      productPrice: '',
      qty: '',
      discount: '',
      totalPrice: '',
      productNote: '',
      emi: '',
      amount: '',
      card: '',
      cheque: '',
      bank: '',
      cash: '',
      paidAmount: '',
      dueAmount: '',
      note: '',
      invoiceDate: '',
      salesPerson: ''
    });


    const handleChange = async (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      if (name === 'cusNic') {
        try {
          const response = await fetch(`${config.BASE_URL}/customer/cusNIC/${value}`);
          if (response.ok) {
            const customerData = await response.json();
            setCusId(customerData.cusId)
            setFormData(prevData => ({
              ...prevData,
              cusNic: customerData.cusNIC || prevData.cusNic,
              cusName: customerData.cusName,
              cusCode: customerData.cusCode
            }));
            setCustomerCreated(true);
          } else {
            setFormData(prevData => ({
              ...prevData,
              cusName: '',
              cusCode: '',
            }));
            console.log('Customer not found');
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }


      if (name === 'productNo' || name === 'productName') {
        try {
          const response = await fetch(`${config.BASE_URL}/product/codeOrName/${value}`);
          if (response.ok) {
            const productData = await response.json();
            setProductId(productData.productId)
            setFormData(prevData => ({
              ...prevData,
              productNo: productData.productCode,
              productName: productData.productName || prevData.productName,
              productPrice: productData.productSellingPrice,
              qty: 1,
              discount: productData.productDiscount,
              totalPrice: productData.productSellingPrice,
              productNote: productData.productWarranty + ' ' + productData.productDescription,
              emi: productData.productEmi
            }));
            if (productData.productId) {
              fetchStockData(productData.productId);
            }
          } else {
            setFormData(prevData => ({
              ...prevData,
              productPrice: '',
              qty: '',
              totalPrice: '',
              productNote: ''
            }));
            console.log('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }

      // When updating the formData for salesPerson
      if (name === 'salesPerson') {
        const selectedUserId = value; // Assuming value contains the user ID
        setFormData(prevData => ({
          ...prevData,
          salesPerson: selectedUserId
        }));
      }

    };

    // Function to fetch stock data based on product ID
    const fetchStockData = async (productId) => {
      try {
        const response = await fetch(`${config.BASE_URL}/stock/product/${productId}`);
        if (response.ok) {
          const stockData = await response.json();
          setStockId(stockData.stockId)
        } else {
          const errorBody = await response.json(); // Log the response body
          console.log('Error fetching stock:', errorBody);
          setFormData(prevData => ({
            ...prevData,
            stockId: ''
          }));
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${config.BASE_URL}/users`);
          if (response.ok) {
            const userData = await response.json();
            setUsers(userData);  // Populate users in state
          } else {
            console.error('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();

      const discountedPrice = (formData.productPrice || 0) * (1 - (formData.discount || 0) / 100);
      const newTotalPrice = discountedPrice * (formData.qty || 1);
      setFormData(prevData => ({ ...prevData, totalPrice: newTotalPrice }));
    }, [formData.productPrice, formData.discount, formData.qty]);


    const handleCustomerCreated = (customerData) => {
      setFormData(prevData => ({
        ...prevData,
        cusName: customerData.cusName,
        cusNic: customerData.cusNIC,
        cusCode: customerData.cusCode,
      }));
      setCustomerCreated(true);
      closeModal();
    };

    const handleAddProduct = (e) => {
      e.preventDefault();

      if (!formData.productNo || !formData.productName || !formData.productPrice || !formData.qty) {
        alert("Please fill in all the product details.");
        return;
      }

      const newRow = [
        formData.cusCode,
        formData.cusName,
        formData.cusNic,
        formData.productNo,
        formData.productName,
        formData.productPrice,
        formData.qty,
        formData.discount,
        formData.totalPrice,
        formData.productNote,
        productId,
        stockId,
      ];

      setTableData(prevData => [...prevData, newRow]);
      setFormData(prevData => ({
        ...prevData,
        productNo: '',
        productName: '',
        productPrice: '',
        qty: '',
        discount: '',
        totalPrice: '',
        productNote: '',
        emi: ''
      }));
      resetSalesPerson();
      console.log("Added new row:", newRow);
      console.log("Updated table data:", [...tableData, newRow]);

      const updatedTableData = [...tableData, newRow];
      let totalAmount = 0;
      let totalDiscount = 0;
      let payableAmount = 0;

      updatedTableData.forEach((row) => {
        const price = parseFloat(row[5]) || 0;
        const qty = parseFloat(row[6]) || 0;
        const discount = parseFloat(row[7]) || 0;
        const totalPrice = parseFloat(row[8]) || 0;

        totalAmount += price * qty;
        totalDiscount += discount;
        payableAmount += totalPrice;
      });

      setFormData((prevData) => ({
        ...prevData,
        totalAmount: totalAmount.toFixed(2),
        discountPrice: totalDiscount.toFixed(2),
        amount: payableAmount.toFixed(2),
      }));

    };

    const generateInvoiceCode = () => {
      return "InvNO" + Date.now().toString().slice(-4);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (!formData.cusCode) {
          throw new Error('Add Customer .');
        }
        if (!formData.invoiceDate) {
          throw new Error('select invoice Date.');
        }
        if (tableData.length === 0) {
          throw new Error('Add Product to table');
        }

        const invoiceData = {
          invoiceNo: generateInvoiceCode(),
          invoiceDate: formData.invoiceDate,
          cusId: cusId,
        };

        console.log('Sending invoice data:', invoiceData);

        const invoiceResponse = await fetch(`${config.BASE_URL}/invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoiceData),
        });

        if (!invoiceResponse.ok) {
          const errorData = await invoiceResponse.json();
          console.error('Invoice error details:', errorData);
          throw new Error(errorData.error || 'Failed to create invoice');
        }

        const invoiceResult = await invoiceResponse.json();
        console.log('Invoice created:', invoiceResult);

        //transaction Data----------------------------------------------------------------------------------
        const transactionData = {
          transactionType: [
            showCard && 'card',
            showCash && 'cash',
            showCheque && 'cheque',
            showBank && 'bank'
          ].filter(Boolean).join(' '),
          price: parseFloat(formData.amount) || 0,
          dateTime: invoiceData.invoiceDate,
          discount: parseFloat(formData.discountPrice) || 0,
          note: formData.note || '',
          paid: parseFloat(formData.paidAmount) || 0,
          due: parseFloat(formData.dueAmount) || 0,
          invoiceId: invoiceResult.invoiceId,
          userId: formData.salesPerson,
        };

        console.log('Sending transaction data:', transactionData);

        const transactionResponse = await fetch(`${config.BASE_URL}/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        if (!transactionResponse.ok) {
          const errorData = await transactionResponse.json();
          console.error('Transaction error details:', errorData);
          throw new Error(errorData.error || 'Failed to create transaction');
        }

        const transactionResult = await transactionResponse.json();
        console.log('Transaction created:', transactionResult);

        //product------------------------------------------------------------------------------------------
        const invalidProducts = tableData.filter(row => !row[3]);
        if (invalidProducts.length > 0) {
          throw new Error('One or more products have an invalid product ID.');
        }

        const productInvoice = tableData.map(row => ({
          productId: row[10], // Ensure this maps correctly to the `productId`
          stockId: row[11],
          invoiceId: invoiceResult.invoiceId,
          totalAmount:row[5]*row[6],
          invoiceQty:row[6],
        }));

        const productResponse = await fetch(`${config.BASE_URL}/invoiceProduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productInvoice),
        });

        if (!productResponse.ok) {
          const errorData = await productResponse.json();
          console.error('Product error details:', errorData);
          throw new Error(errorData.error || 'Failed to send Product');
        }

        const productResult = await productResponse.json();
        console.log('Product ID before sending:', productId);
        console.log('Sending product data:', productInvoice);
        console.log('product created:', productResult);


        alert('Invoice and transaction created successfully!');

        setTableData([]);
        resetForm();
        resetSalesPerson();
      } catch (error) {
        console.error('Error:', error);
        alert(`Failed to process: ${error.message}`);
      }
    };
    
    const resetForm = () => {
      setFormData({
        cusName: '',
      cusNic: '',
      cusCode: '',
      productNo: '',
      productName: '',
      productPrice: '',
      qty: '',
      discount: '',
      totalPrice: '',
      productNote: '',
      emi: '',
      amount: '',
      card: '',
      cheque: '',
      bank: '',
      cash: '',
      paidAmount: '',
      dueAmount: '',
      note: '',
      invoiceDate: '',
      totalAmount: '',
      discountPrice: '',
      });
    };
    

    const resetSalesPerson = () => {
      setFormData(prevData => ({
        ...prevData,
        salesPerson: 'select',
      }));
    };

    const openModal = () => {
      setModalIsOpen(true);
    };

    const closeModal = () => {
      setModalIsOpen(false);
    };

    const [Emi, setEmi] = useState(false);
    const handleEmi = (e) => {
      setEmi(e.target.checked)
    }

    const [showCard, setCard] = useState(false);
    const [showCash, setCash] = useState(false);
    const [showCheque, setCheque] = useState(false);
    const [showBank, setBank] = useState(false);

    const handleCard = (e) => {
      setCard(e.target.checked)
    }
    const handleCash = (e) => {
      setCash(e.target.checked)
    }
    const handleCheque = (e) => {
      setCheque(e.target.checked)
    }
    const handleBank = (e) => {
      setBank(e.target.checked)
    }

    const handlePaymentChange = (e) => {
      const { name, value } = e.target;
      const numericValue = parseFloat(value) || 0;

      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));

      const totalPaid = parseFloat(name === 'card' ? numericValue : formData.card || 0)
        + parseFloat(name === 'cheque' ? numericValue : formData.cheque || 0)
        + parseFloat(name === 'bank' ? numericValue : formData.bank || 0)
        + parseFloat(name === 'cash' ? numericValue : formData.cash || 0);

      const payableAmount = parseFloat(formData.amount) || 0;
      const dueAmount = payableAmount - totalPaid;

      setFormData((prevData) => ({
        ...prevData,
        paidAmount: totalPaid.toFixed(2),
        dueAmount: dueAmount.toFixed(2),
      }));
    };
    const clear = () => {
      setTableData([]);
      setFormData({
        cusName: '',
        cusNic: '',
        cusCode: '',
        productNo: '',
        productName: '',
        productPrice: '',
        qty: '',
        discount: '',
        totalPrice: '',
        productNote: '',
        emi: '',
        amount: '',
        card: '',
        cheque: '',
        bank: '',
        cash: '',
        paidAmount: '',
        dueAmount: '',
        note: '',
        invoiceDate: '',
        totalAmount: '',
        discountPrice: '',
      });
      resetSalesPerson();
    }

  return (
    <div>
      <div className="scrolling-container">
        <h4>Sales Invoice</h4>
        <form action="" onSubmit={handleSubmit} >
          <div className="customer-form">
            <div className="sales-add-form">
              <div className="customer">
                <div className="subCaption">

                  <p><User />Customer Details</p>
                  <button className='addCusBtn' type="button" onClick={openModal}><PlusCircle size={30} /></button>
                </div>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="New Customer Form"
                >
                  <Form closeModal={closeModal} onSave={handleCustomerCreated} />
                </Modal>

                <div className="customer-details">
                  <label htmlFor="">Customer Nic</label>
                  <input onChange={handleChange} value={formData.cusNic} type="text" className="form-control" name="cusNic" id="cusNic" placeholder="Enter Nic" />
                </div>

                <div className="customer-details">
                  <label htmlFor="">Customer Name</label>
                  <input onChange={handleChange} value={formData.cusName} type="text" className="form-control" name="cusName" id="cusName" placeholder="Enter Name" />
                </div>

                <div className="customer-details">
                  <label htmlFor="">Customer Code</label>
                  <input onChange={handleChange} value={formData.cusCode} type="text" className="form-control" name="cusCode" id="refNo" placeholder="Enter No" />
                </div>
              </div>

              <div className="product">
                <div className="subCaption">
                  <p><ShoppingCart /> Product Details</p>
                </div>
                <div className="row">
                  <div className="product-details col-md-4 mb-2">
                    <input onChange={handleChange} value={formData.productNo} type="text" name="productNo" className="form-control" id="productNo" placeholder="Product Code" />
                  </div>
                  <div className="product-details col-md-8 mb-2">
                    <input onChange={handleChange} value={formData.productName} type="text" name="productName" className="form-control" id="productName" placeholder="Product Name" />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <input onChange={handleChange} value={formData.productPrice} type="number" name="productPrice" className="form-control" id="price" placeholder="Product Price" onWheel={(e) => e.target.blur()} />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <input onChange={handleChange} value={formData.qty} type="number" onWheel={(e) => e.target.blur()} name="qty" className="form-control" id="qty" placeholder="Enter Quantity" />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <input onChange={handleChange} value={formData.discount} type="number" onWheel={(e) => e.target.blur()} name="discount" className="form-control" id="discount" placeholder="Product Discount %" />
                  </div>
                  <div className="product-details col-md-3 mb-2">
                    <input onChange={handleChange} value={formData.totalPrice} type="number" onWheel={(e) => e.target.blur()} name="totalPrice" className="form-control" id="totalPrice" placeholder="Total Price" />
                  </div>
                  <div className="product-details col-md-6 mb-2">
                    <textarea onChange={handleChange} value={formData.productNote} name="productNote" className="form-control" id="productNote" placeholder="Warranty" rows="3"></textarea>
                  </div>
                  {/* <div className="product-details-checkbox col-md-1 mb-2">
                    <input type="checkbox" id="emi" name="emi" value="EMI" onChange={handleEmi} />
                    <label htmlFor="emi">Imei</label>
                  </div> */}
                  {/* {Emi && (
                    <div className="product-details col-md-5">
                      <input onChange={handleChange} value={formData.emi} type="text" name="emi" className="form-control" id="emi" placeholder="Imei/Serial Number" />
                    </div>
                  )} */}

                </div>
              </div>
            </div>
            <div className="sales-addbtn d-grid d-md-flex me-md-2 justify-content-end px-5">
              <button className="btn btn-primary btn-md" onClick={handleAddProduct}>Add Product</button>
            </div>
          </div>

          <div className="product-table">
            <Table
              data={tableData}
              columns={Columns}
              showSearch={false}
              showButton={false}
              showActions={false}
              showRow={false}
              showDate={false}
              showPDF={false}
            />
          </div>

          <div className="payment-form">
            <div className="payment-form-group">
              <div className="sales-person-box">
                <div className="sales-person">
                  <label id='label'>Sales Person</label>
                  <select className="form-control" name="salesPerson" value={formData.salesPerson} onChange={handleChange}>
                    <option value="Select">Select</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.userId}>
                        {user.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sales-person">
                  <label htmlFor="" id='label'>Invoice Date</label>
                  <input type="datetime-local" className="form-control" name="invoiceDate" onChange={handleChange} value={formData.invoiceDate} id="date" />
                </div>
                {/* <div className="sales-person">
                  <label htmlFor="" id='label'>Invoice Due Date</label>
                  <input type="datetime-local" className="form-control" name="invoiceDueDate" id="date" />
                </div> */}
              </div>

              <div className="amount-box">
                <div className="amount-group">
                  <label htmlFor="" id='label'>Total Amount</label>
                  <input type="number" className="form-control" value={formData.totalAmount} onChange={handleChange} id='readOnly' readOnly />
                </div>
                <div className="amount-group">
                  <label htmlFor="" id='label'>Discount</label>
                  <input type="number" className="form-control" value={formData.discountPrice} onChange={handleChange} id='readOnly' readOnly />
                </div>

                <div className="amount-group">
                  <label htmlFor="" id='label'>Invoice Note</label>
                  <textarea className="form-control" onChange={handleChange} value={formData.note} name='note' id="invoiceNote" rows={3} />
                </div>
              </div>
            </div>

            <div className="payment-form-group">
              <div className="payment-details-box">
                <div className="payment-details">
                  <label htmlFor="" id='label'>Payable Amount</label>
                  <input type="number" className="form-control" value={formData.amount} id='readOnly' readOnly />
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="cashAmount" id="cashAmount" onChange={handleCash} />
                    <label htmlFor="" id='label'>Cash Payment</label>
                  </div>

                  {showCash && (
                    <input type="number" className="form-control" id='payment' name='cash' value={formData.cash} onChange={handlePaymentChange} placeholder='Cash Amount' onWheel={(e) => e.target.blur()} />
                  )}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="card" id="card" onChange={handleCard} />
                    <label htmlFor="" id='label'>Card Payment</label>
                  </div>
                  {showCard && (
                    <input type="number" className="form-control" id='' name='card' onChange={handlePaymentChange} value={formData.card} placeholder='Card Payment' onWheel={(e) => e.target.blur()} />

                  )}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="cheque" id="cheque" onChange={handleCheque} />
                    <label htmlFor="" id='label'>Cheque Payment</label>
                  </div>
                  {showCheque && (
                    <input type="number" className="form-control" id='' name='cheque' value={formData.cheque} onChange={handlePaymentChange} placeholder='Cheque Payment' onWheel={(e) => e.target.blur()} />
                  )}
                </div>
                <div className="payment-details">
                  <div className="payment-details-amount">
                    <input type="checkbox" name="bank" id="bank" onChange={handleBank} />
                    <label htmlFor="" id='label'>Bank Payment</label>
                  </div>
                  {showBank && (
                    <input type="number" className="form-control" id='' name='bank' value={formData.bank} onChange={handlePaymentChange} placeholder='Bank Payment' onWheel={(e) => e.target.blur()} />
                  )}
                </div>
              </div>

              <div className="amount-box">
                <div className="amount-group">
                  <label htmlFor="" id='label'>Paid Amount</label>
                  <input className="form-control" value={formData.paidAmount} type="number" onWheel={(e) => e.target.blur()} name="totalAmount" id="readOnly" readOnly />
                </div>
                <div className="amount-group">
                  <label htmlFor="" id='label'>Due Amount</label>
                  <input className="form-control" type="number" value={formData.dueAmount} onWheel={(e) => e.target.blur()} name="discount" id="readOnly" readOnly />
                </div>
                {/* <div className="amount-group">
                  <label htmlFor="" id='label'>If Credit Sale</label>
                </div> */}
              </div>
            </div>

            <div className="payment-form-button  d-grid d-md-flex me-md-2 justify-content-end px-5">
              <button className='btn btn-danger btn-md mb-2' type='reset' onClick={clear} >Cancel</button>
              <button className='btn btn-primary btn-md mb-2' type='submit'>Create invoice</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewSales