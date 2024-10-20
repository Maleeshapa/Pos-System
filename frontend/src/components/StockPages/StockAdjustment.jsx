import React, { useState } from 'react';
import Table from '../Table/Table'
import { useNavigate } from 'react-router-dom';

const StockAdjustment = () => {
    const [data,] = useState([
    ]);
    const Columns = ["id", 'No', 'Retun Date', 'Customer', 'Store', 'Total Item', 'handle by', 'Item Info'];

    const btnName = 'Stock Adjustment';

    const navigate = useNavigate()

    const handleReturnStock = () => {
        navigate('/stock/adjustment_history');
    };

    return (
        <div>
            <div className="scrolling-container">
                <h4>Stock Adjustment</h4>
                <div className="row">
                    <div className="Stock-details col-md-4 mt-3 mb-3 ">
                        <label htmlFor="">Store</label>
                        <select name="store" id="" className='form-control'>
                            <option value="">select store</option>
                            <option value="Main">Main</option>
                            <option value="Sub">Sub</option>
                        </select>
                    </div>
                    <div className="Stock-details col-md-4 mt-3 mb-3 ">
                        <label htmlFor="">Note</label>
                        <input type="text" name='' id='' placeholder='note' className='form-control' />
                    </div>
                    <Table
                        data={data}
                        columns={Columns}
                        btnName={btnName}
                        onAdd={handleReturnStock}
                        showActions={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default StockAdjustment