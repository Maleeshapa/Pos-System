import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CreateProduct from '../../components/ProductPages/CreateProduct'
import CreateProductLable from '../../components/ProductPages/CreateProductLable'
import ProductList from '../../components/ProductPages/ProductList'
import ProductCategory from '../../components/ProductPages/ProductCategory'
import Header from '../../components/SideBar/Header'

const Product = () => {
  return (
    <div>
      <div className='show-Header'><Header /></div>
      <Routes>
        <Route path='create' element={<CreateProduct />} />
        <Route path='category' element={<ProductCategory />} />
        <Route path='product-lable' element={<CreateProductLable />} />
        <Route path='product-list' element={<ProductList />} />
      </Routes>
    </div>
  )
}

export default Product