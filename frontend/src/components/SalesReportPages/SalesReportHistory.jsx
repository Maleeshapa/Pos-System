import { useEffect, useState } from 'react'
import Table from '../Table/Table';
import config from '../../config';

const SalesHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = ['Date & Time', 'Product Name', 'Size', 'Customer Name', 'Sold Price', 'Profit/Loss'];

  useEffect(() => {
    fetchSummery();
  }, []);

  const fetchSummery = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoices`);
      if (!response.ok) {
        throw new Error('Failed to fetch Sales Invoices');
      }
      const invoices = await response.json();
      const formattedData = invoices.map(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);

        // Format dates to "YYYY-MM-DD HH:mm"
        const formattedInvoiceDate = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')} ${String(invoiceDate.getHours()).padStart(2, '0')}:${String(invoiceDate.getMinutes()).padStart(2, '0')}`;

        // Calculate total profit
        const totalProfit = (invoice.product?.productProfit || 0) * (invoice.invoiceQty || 0);

        return [
          formattedInvoiceDate,
          invoice.product?.productName || "Unknown",
          invoice.invoiceQty,
          invoice.customer?.cusName || "Unknown",
          invoice.product?.productSellingPrice || "Unknown",
          totalProfit
        ];
      });
      setData(formattedData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const title = 'Sales History Report';
  const invoice = 'Sales History Report.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Sales History Report</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Table
            search={'Search by Customer Name , Product Name'}
            data={data}
            columns={columns}
            showButton={false}
            title={title}
            showActions={false}
            invoice={invoice}
          />
        )}
      </div>
    </div>
  )
}

export default SalesHistory