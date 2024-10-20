import { useEffect, useState } from "react";
import Table from '../Table/Table';
import config from '../../config'

const RentalHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = ["ID", "Date/time", "Total Amount", "Advance Payment ", "Customer", "Products"];

  const btnName = 'Add New Sale'

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/rentalInvoices`);
      if (!response.ok) {
        throw new Error('Failed to fetch Rental Invoice');
      }
      const rentalInvoice = await response.json();
      const formattedData = rentalInvoice.map(rentalInvoice => [
        rentalInvoice.rentalInvoiceId,
        rentalInvoice.rentalInvoiceDate,
        rentalInvoice.rentalInvoiceTotalAmount,
        rentalInvoice.rentalInvoiceAdvancePayment,
        rentalInvoice.customer?.cusName,
        rentalInvoice.product?.productName,
      ]);
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="scrolling-container">
        <h4>Rental History</h4>
        <div>
          <Table
            data={data}
            columns={columns}
            btnName={btnName}
          />
        </div>
      </div>
    </div>
  )
}

export default RentalHistory