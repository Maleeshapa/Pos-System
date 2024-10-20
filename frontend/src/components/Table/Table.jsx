import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import './Table.css'

const Table = ({
    data,
    title,
    invoice,
    columns,
    onAdd,
    btnName,
    onEdit,
    onDelete,
    showSearch = true,
    showButton = true,
    showActions = true,
    showEdit = true,
    showDelete = true,
    showRow = true,
    showPDF = true,
    showDate = true,
}) => {
    const [tableData, setTableData] = useState(data);
    const [tableColumns, setTableColumns] = useState(columns);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    useEffect(() => {
        setTableData(Array.isArray(data) ? data : []);
    }, [data]);


    useEffect(() => {
        setTableColumns(columns);
    }, [columns]);

    const filteredData = tableData.filter((tableDatum) => {
        const query = searchQuery.toLowerCase();
        const isWithinDateRange = (!startDate && !endDate) || (new Date(tableDatum[1]) >= new Date(startDate) && new Date(tableDatum[1]) <= new Date(endDate));


        return isWithinDateRange && Array.isArray(tableDatum) && tableDatum.some((item) => {
            return item != null && item.toString().toLowerCase().includes(query);
        });
    });

    const currentItems = itemsPerPage === -1
        ? filteredData
        : filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(title, 20, 20);

        const headers = columns.map(column => ({ content: column, styles: { halign: 'center' } }));
        const tableData = filteredData.map(row => row.map(cell => ({ content: cell, styles: { halign: 'center' } })));

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            theme: 'striped',
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            styles: { fontSize: 5, halign: 'center', valign: 'middle' },
            headStyles: { fillColor: [255, 216, 126], textColor: 0, fontSize: 5 },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [250, 250, 250] }
        });

        doc.save(invoice);
    };

    const resetFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };
    return (
        <div className="scroll-table">
            <div className="container-fluid p-2">

                <div className="flex-t-h">
                    {showSearch && (
                        <div className="mb-2 me-2">
                            <input
                                type="text"
                                className="form-control form-con"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}

                    {showRow && (
                        <div className="mb-2 me-2">
                            <select
                                className="form-control form-con-row"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={-1}>All</option>
                            </select>
                        </div>
                    )}

                    <div className="d-flex ms-auto  flex-se">
                        {showDate && (
                            <div className="d-flex me-2 date">
                                <div className="mb-2 me-2">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        placeholderText="Start Date"
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className="mb-2 me-2">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        placeholderText="End Date"
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div>
                                    <button className="btn btn-danger" onClick={resetFilters}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {showPDF && (
                            <div className="me-2">
                                <button className="btn btn-secondary btn-sm" onClick={generatePDF}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showButton && (
                    <div className=" d-flex justify-content-end">
                        <button className="btn btn-info text-dark" onClick={onAdd}>
                            {btnName}
                        </button>
                    </div>
                )}

                <div className="mt-2">
                    <div className="col-md-12">
                        <table className="table table-hover table-responsive">
                            <thead>
                                <tr>
                                    {tableColumns.map((item, index) => (
                                        <th key={index} style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>{item}</th>
                                    ))}
                                    {showActions && (
                                        <th style={{ backgroundColor: 'black', color: 'white' }}>Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((datum, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {datum.map((item, colIndex) => (
                                            <td key={colIndex} style={{ textAlign: 'center' }} >{item}</td>
                                        ))}
                                        {showActions && (
                                            <td>
                                                {showEdit && (
                                                    <button
                                                        className="btn btn-warning btn-sm mr-3"
                                                        onClick={() => onEdit(rowIndex)}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                )}
                                                {' '}
                                                {showDelete && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => onDelete(rowIndex)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
