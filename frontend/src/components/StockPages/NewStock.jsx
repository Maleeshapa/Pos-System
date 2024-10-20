import React, { useEffect, useState } from 'react';
import './NewStock.css';
import Table from '../Table/Table';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const NewStock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [tableData, setTableData] = useState(data || []);
  const [productSuggestions, setProductSuggestions] = useState([]);

  const columns = [
    'Stock Name', 'Supplier Name', 'Store', 'Supplied Date & Time', 'Product Name', 'Product Category', 'M Date', 'Exp Date', 'Price Per Item', 'Supplied Quantity', 'Total Price Before VAT', 'VAT %', 'Total Amount + VAT', 'Cash Amount', ' Cheque Amount', 'Due', 'Description'
  ];

  const [formData, setFormData] = useState({
    stockName: '',
    supplier: '',
    store: '',
    date: '',
    cashAmount: '',
    chequeAmount: '',
    due: '',
    product: '',
    category: '',
    mfd: '',
    exp: '',
    price: '',
    qty: '',
    totalPrice: '',
    vat: '',
    totalPriceVAT: '',
    description: '',
  });

  const initialFormState = {
    stockName: '',
    supplier: '',
    store: '',
    date: '',
    cashAmount: '',
    chequeAmount: '',
    due: '',
    product: '',
    category: '',
    mfd: '',
    exp: '',
    price: '',
    qty: '',
    totalPrice: '',
    vat: '',
    totalPriceVAT: '',
    description: '',
  };

  useEffect(() => {
    fetchStock();
    fetchStores();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/stocks`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock list');
      }
      const stockList = await response.json();

      const formattedData = stockList.map(stock => {
        return [
          stock.stockId,
          stock.supplier?.supplierName || "Unknown",
          stock.product?.productName || 'Unknown',
          stock.stockDate,
          stock.stockQty,
          stock.product?.productBuyingPrice,
          stock.stockPrice,
          stock.vat,
          stock.total,
          stock.cashAmount || '-',
          stock.chequeAmount || '-',
        ];
      });

      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/suppliers`);
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        console.error('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === 'date' && value) {
        const dateObject = new Date(value);
        newData.date = dateObject.toISOString().slice(0, 16);
      }


      // Calculate total price when price or qty changes
      if (name === 'price' || name === 'qty') {
        const price = parseFloat(newData.price) || 0;
        const qty = parseFloat(newData.qty) || 0;
        newData.totalPrice = (price * qty).toFixed(2);
      }

      // Calculate VAT and total price with VAT
      if (newData.vat && newData.totalPrice) {
        const vatAmount = (parseFloat(newData.vat) / 100) * parseFloat(newData.totalPrice);
        newData.totalPriceVAT = (parseFloat(newData.totalPrice) + vatAmount).toFixed(2);
      }

      // Calculate due amount
      const cashAmount = parseFloat(newData.cashAmount) || 0;
      const chequeAmount = parseFloat(newData.chequeAmount) || 0;
      const totalPaidAmount = cashAmount + chequeAmount;

      newData.due = (totalPaidAmount - parseFloat(newData.totalPriceVAT)).toFixed(2);

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    const formattedDate = formData.date.replace('T', ' ');

    formDataToSend.append('stockName', formData.stockName);
    formDataToSend.append('stockDate', formattedDate);

    formDataToSend.append('stockPrice', formData.totalPrice);
    formDataToSend.append('due', formData.due);
    formDataToSend.append('vat', formData.vat);
    formDataToSend.append('total', formData.totalPriceVAT);
    formDataToSend.append('productId', formData.product);
    formDataToSend.append('stockQty', formData.qty);
    formDataToSend.append('supplierId', formData.supplier);
    formDataToSend.append('storeId', formData.store);
    formDataToSend.append('categoryId', formData.category);
    formDataToSend.append('mfd', formData.mfd);
    formDataToSend.append('exp', formData.exp);
    formDataToSend.append('cashAmount', formData.cashAmount);
    formDataToSend.append('chequeAmount', formData.chequeAmount);

    if (formData.description) {
      formDataToSend.append('stockDescription', formData.description);
    }

    if (image) {
      formDataToSend.append('billImage', image);
    }

    try {
      const response = await fetch(`${config.BASE_URL}/stock`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save stock');
      }

      const result = await response.json();
      console.log('Stock saved successfully:', result);
      setSuccessMessage('Stock saved successfully!');
      resetForm();
      fetchStock();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while saving the stock.');
    }
  };

  const handleProductSearch = async (e) => {
    const query = e.target.value;
    setProductSearch(query);

    if (query.length >= 2) {
      try {
        const response = await fetch(`${config.BASE_URL}/products/suggestions?query=${query}`);
        if (response.ok) {
          const suggestions = await response.json();
          setProductSuggestions(suggestions);
        } else {
          console.error('Failed to fetch product suggestions');
        }
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    } else {
      setProductSuggestions([]);
    }
  };

  const handleProductSelect = async (productName) => {
    setProductSearch(productName);
    setProductSuggestions([]);

    try {
      const response = await fetch(`${config.BASE_URL}/product/productName/${productName}`);
      if (response.ok) {
        const product = await response.json();
        setFormData(prevData => ({
          ...prevData,
          product: product.productId,
          category: product.category_categoryId,
          price: product.productBuyingPrice,
        }));
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImage(null);
    setPreview('');
    setProductSearch('');
  };

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
  };
  
  const navigate = useNavigate();

  const handleNewStockClick = () => {
    navigate('/stock-reports/current-stock');
  };

  const handleAddStock = (e) => {
    e.preventDefault();


    if (!formData.stockName || !formData.supplier || !formData.date ||
      !formData.cashAmount || !formData.due || !formData.category || !formData.totalPrice) {
      alert("Please fill necessary details.");
      return;
    }

    const formattedDate = formData.date.replace('T', ' ');
    // Create a new row from formData
    const newRow = [
      formData.stockName,
      formData.supplier,
      formData.store,
      formattedDate,
      formData.product,
      formData.category,
      formData.mfd,
      formData.exp,
      formData.price,
      formData.qty,
      formData.totalPrice,
      formData.vat,
      formData.totalPriceVAT,
      formData.cashAmount,
      formData.chequeAmount,
      formData.due,
      formData.description
    ];


    setTableData(prevData => {
      const updatedData = [...prevData, newRow];
      console.log("Added new row:", newRow);
      console.log("Updated table data:", updatedData);
      return updatedData;
    });
    // Reset form fields after adding to table
    setFormData(prevData => ({
      ...prevData,
      stockName: '',
      cashAmount: '',
      chequeAmount: '',
      due: '',
      product: '',
      category: '',
      mfd: '',
      exp: '',
      price: '',
      qty: '',
      totalPrice: '',
      vat: '',
      totalPriceVAT: '',
      description: '',
    }));

    // Update table data 

  };



  return (
    <div className="scrolling-container">
      <div className="container-fluid my-5 mt-2">
        <h4 className="mb-4">Create New Stock</h4>
        {/* {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )} */}

        <div className="d-flex justify-content-end mt-4">
          <button className='btn btn-warning' onClick={handleNewStockClick}>Current Stock</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <label htmlFor="stockName" className="form-label">Stock Name / Stock Number</label>
              <input type="text" name="stockName" value={formData.stockName} className="form-control" onChange={handleChange} />
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="supplier" className="form-label">Supplier Name</label>
                  <select name="supplier" value={formData.supplier} className="form-select" onChange={handleChange}>
                    <option value="select">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="store" className="form-label">Store</label>
                  <select name="store" value={formData.store} onChange={handleChange} className="form-select">
                    <option value="">Select Store</option>
                    {stores.map((store) => (
                      <option key={store.storeId} value={store.storeId}>
                        {store.storeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="date" className="form-label">Supplied Date</label>
                <input type="datetime-local" name="date" value={formData.date} className="form-control" onChange={handleChange} />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="cashAmount" className="form-label">Cash Amount</label>
                  <input type="number" name="cashAmount" value={formData.cashAmount} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="chequeAmount" className="form-label">Cheque Amount</label>
                  <input type="number" name="chequeAmount" value={formData.chequeAmount} className="form-control" onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="due" className="form-label">Due</label>
                <input type="text" name="due" value={formData.due} className="form-control" readOnly />
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">Bill Image</label>
                <input type="file" name="image" accept="image/*" className="form-control" onChange={handleImageChange} />
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="Bill" className="img-thumbnail" style={{ maxWidth: '200px' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="productSearch" className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="productSearch"
                    className="form-control"
                    value={productSearch}
                    onChange={handleProductSearch}
                  />
                  {productSuggestions.length > 0 && (
                    <ul className="list-group mt-0">
                      {productSuggestions.map((product, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleProductSelect(product.productName)}
                        >
                          {product.productName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">Product Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="" className='mb-1'>Manufacture Date </label>
                  <input onChange={handleChange} type="date" name='mfd' id='' onWheel={(e) => e.target.blur()} value={formData.mfd} className='form-control' />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="" className='mb-1'>Expiration date</label>
                  <input onChange={handleChange} type="date" name='exp' id='' onWheel={(e) => e.target.blur()} value={formData.exp} className='form-control' />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input type="number" name="price" value={formData.price} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="qty" className="form-label">Quantity</label>
                  <input type="number" name="qty" value={formData.qty} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="totalPrice" className="form-label">Total Price</label>
                  <input type="text" name="totalPrice" value={formData.totalPrice} className="form-control" readOnly />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="vat" className="form-label">VAT %</label>
                  <input type="number" name="vat" value={formData.vat} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="totalPriceVAT" className="form-label">Total Price + VAT</label>
                  <input type="text" name="totalPriceVAT" value={formData.totalPriceVAT} className="form-control" readOnly />
                </div>
              </div>
              <div className="product-details col-md-4 mb-2">
                <label htmlFor="" className='mb-1'>Description</label>
                <textarea onChange={handleChange} name='description' id='' value={formData.description} className='form-control' rows={2}></textarea>
              </div>

              {/* <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-primary" onClick={handleAddStock}>Add Stock +</button>
              </div> */}
            </div>
          </div>

          {/* Table */}
          {/* <div className="table-responsive mt-5">
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
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Table
                search="Search"
                data={tableData}
                columns={columns}
                showButton={false}
                showActions={false}
                showSearch={false}
                showPDF={false}
                showDate={false}
                showRow={false}
              />
            )}
          </div> */}

          {/* Footer Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <button type="reset" className="btn btn-danger me-2" onClick={resetForm}>Clear</button>
            <button type="submit" className="btn btn-success">New Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStock;