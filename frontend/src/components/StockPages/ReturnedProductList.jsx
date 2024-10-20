import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table'
import config from '../../config';

const ReturnedProductList = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const Columns = ["id", 'Return Type', 'Return Date', 'Product', 'Store', 'handle by', 'Invoice id'];
    const btnName = 'Create Return item';

    const navigate = useNavigate();

    const handleCreateReturn = () => {
        navigate('/stock/create');
    };

    useEffect(() => {
        fetchReturn();
    }, []);

    const fetchReturn = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/returns`);
            if (!response.ok) {
                throw new Error('Failed to fetch return list');
            }
            const returns = await response.json();

            const formattedData = returns.map(returns => {
                const returnDate = new Date(returns.returnItemDate).toLocaleString();

                return [
                    returns.returnItemId,
                    returns.returnItemType,
                    returnDate,
                    returns.products?.productName,
                    returns.store?.storeName,
                    returns.user?.userName,
                    returns.invoice?.invoiceNo,
                ];
            });

            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


    const title = 'Returned Product List';
    const invoice = 'Returned Product List.pdf';

    return (
        <div>
            <div className="scrolling-container">
                <h4>Returned Product List</h4>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div className="">
                        <Table
                            data={data}
                            columns={Columns}
                            btnName={btnName}
                            onAdd={handleCreateReturn}
                            showActions={false}
                            title={title}
                            invoice={invoice}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReturnedProductList