import React, { useState } from 'react';
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom';

const StockAdjustmentHistory = () => {
    const [data,] = useState([
    ]);
    const Columns = ["id", 'No', 'Retun Date', 'Customer', 'Store', 'Total Item', 'handle by', 'Item Info'];

    const btnName='stock Ajustment History'

    const navigate=useNavigate();
    const handleStockHistory = () => {
        navigate('/stock/adjustment');
    };

    return (
        <div>
            <div className="scrolling-container">
                <h4>Stock Adjustment history</h4>
                <div className="row">
                    <div className="Stock-details col-md-4 mt-3 mb-3 ">
                        <label htmlFor="">Store</label>
                        <select name="store" id="" className='form-control'>
                            <option value="">select store</option>
                            <option value="Main">Main</option>
                            <option value="Sub">Sub</option>
                        </select>
                    </div>
                    <Table
                        data={data}
                        columns={Columns}
                        btnName={btnName}
                        onAdd={handleStockHistory}
                        showActions={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default StockAdjustmentHistory