import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = ['id', 'Product', 'Product Code', 'Weight(g/Kg)', 'Buying Price', 'Selling Price', 'Warranty (months)', 'Profit', 'Description', 'Category', 'Status'];

  const btnName = ['Add Product'];

  useEffect(() => {
    fetchProductList();
  },);

  const fetchProductList = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/products`);
      if (!response.ok) {
        setError(`Failed to fetch product list: ${response.status} ${response.statusText}`);
      }
      const prod = await response.json();
      const formattedData = prod.map(prod => [
        prod.productId,
        prod.productName,
        prod.productCode,
        prod.productUnit,
        prod.productBuyingPrice,
        prod.productSellingPrice,
        prod.productWarranty,
        prod.productProfit,
        prod.productDescription,
        prod.category?.categoryName,
        <select
          className='form-control'
          value={prod.productStatus}
          onChange={(e) => handleStatusChange(prod.productId, e.target.value)}
        >
          <option value="In stock">In stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(`Error fetching product list: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update product status: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      await fetchProductList();
    } catch (error) {
      setError(`Error updating product status: ${error.message}`);
    }
  };

  const handleDelete = async (rowIndex) => {
    try {
      const productId = data[rowIndex][0];
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete Product: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }

      setData(prevData => prevData.filter((_, index) => index !== rowIndex));
      await fetchProductList();
    } catch (err) {
      setError(`Error deleting product: ${err.message}`);
    }
  };

  const handleEdit = (rowIndex) => {
    const selectedProdData = data[rowIndex];
    const selectedProd = {
      productId: selectedProdData[0],
      category: selectedProdData[9],
      productName: selectedProdData[1],
      productCode: selectedProdData[2],
      productUnit: selectedProdData[3],
      productBuyingPrice: selectedProdData[4],
      productSellingPrice: selectedProdData[5],
      productWarranty: selectedProdData[6],
      productProfit: selectedProdData[7],
      productDescription: selectedProdData[8],
    };

    navigate('/product/create', { state: { selectedProd } });
  };

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/product/create');
  };

  const markAsOutOfStock = async (rowIndex) => {
    try {
      const productId = data[rowIndex][0];
      const response = await fetch(`${config.BASE_URL}/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productStatus: 'Out of Stock', productQty: 0 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update product to out of stock: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      await fetchProductList();
    } catch (err) {
      setError(`Error marking product as out of stock: ${err.message}`);
    }
  };

  const title = 'Product List';
  const invoice = 'product_list.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Product List</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
            <button className='btn btn-danger' onClick={fetchProductList}>Retry</button>
          </div>
        ) : (
          <Table
            data={data}
            columns={columns}
            btnName={btnName}
            onAdd={handleAddProduct}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onMarkOutOfStock={markAsOutOfStock}
            showDate={false}
            title={title}
            invoice={invoice}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;