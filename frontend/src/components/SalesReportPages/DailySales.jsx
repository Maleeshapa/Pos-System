import { useEffect, useState } from 'react'
import Table from '../Table/Table';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function DailySales() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = ['Date & Time', 'Product Name', 'Size', 'Customer Name', 'Customer Nic', 'Sold Price', 'Profit/Loss'];
  const btnName = '+ New Sale';

  useEffect(() => {
    fetchSummery();
  }, []);

  const fetchSummery = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/invoices`);
      if (!response.ok) {
        setError('Failed to fetch Sales Invoices');
        setIsLoading(false);
        return;
      }
      const invoices = await response.json();

      // Get today's date
      const today = new Date();
      const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // Filter invoices for today's sales
      const todaySales = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        const formattedInvoiceDate = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')}`;
        return formattedInvoiceDate === formattedToday;
      });

      const formattedData = todaySales.map(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);

        // Format date and time to "YYYY-MM-DD HH:mm"
        const formattedInvoiceDate = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-${String(invoiceDate.getDate()).padStart(2, '0')} ${String(invoiceDate.getHours()).padStart(2, '0')}:${String(invoiceDate.getMinutes()).padStart(2, '0')}`;

        // Calculate total profit
        const totalProfit = (invoice.product?.productProfit || 0) * (invoice.invoiceQty || 0);

        return [
          // invoice.invoiceId,
          formattedInvoiceDate,
          invoice.product?.productName || "Unknown",
          invoice.invoiceQty,
          invoice.customer?.cusName || "Unknown",
          invoice.customer?.cusNIC || "Unknown",
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

  const navigate = useNavigate();

  const handleNewSale = () => {
    navigate('/sales/new');
  }
  const title = 'Day Job Report';
  const invoice = 'Day Job Report.pdf';

  return (
    <div>
      <div className="scrolling-container">
        <h4>Day Job Report</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Table
            search={'Search by Customer Name , Product Name'}
            data={data}
            columns={columns}
            btnName={btnName}
            onAdd={handleNewSale}
            showActions={false}
            showDate={false}
            title={title}
            invoice={invoice}
          />
        )}
      </div>
    </div>
  )
}

export default DailySales;
