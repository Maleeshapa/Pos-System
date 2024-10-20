import { useEffect, useState } from "react";
import Table from '../Table/Table';
import config from '../../config';
import 'react-datepicker/dist/react-datepicker.css';

const SalesHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = ["ID", "Date/time", "Total Amount", "Customer", "Products"];
  const btnName = 'Add New Sale';

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const fetchSalesHistory = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoices`);
      if (!response.ok) {
        setError('Failed to fetch Sales Invoices');
      }
      const invoices = await response.json();
      const formattedData = invoices.map(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);

        // Format dates to "YYYY-MM-DD HH:mm"
        const formattedInvoiceDate = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')} ${String(invoiceDate.getHours()).padStart(2, '0')}:${String(invoiceDate.getMinutes()).padStart(2, '0')}`;

        return [
          invoice.invoiceId,
          formattedInvoiceDate,
          invoice.totalAmount,
          invoice.customer?.cusName || "Unknown",
          invoice.product?.productName || "Unknown"
        ];
      });
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  const title = 'Sales History';
  const invoice = 'Sales History.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <div className="new-sales-container">
          <h4>Sales History</h4>

          {isLoading ? (
            <p>Loading...</p>
            // ) : error ? (
            //   <p>Error: {error}</p>
          ) : (
            <Table
              data={data}
              columns={columns}
              btnName={btnName}
              title={title}
              invoice={invoice}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
