import React from 'react';
import './Dashboard.css'

function CardOne({ TodayTotal, YesterdayTotal, ThisMonthTotal, LastMonthTotal,todayTotalSales,monthTotalSales }) {
  return (
    <div className="card h-100">
      <div className="card-header">Total Sales Earnings</div>
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">Today</h5>
            <p className="card-text">{TodayTotal}</p>
            <span>{todayTotalSales} Sales </span>
          </div>
          <div className="col-6">
            <h5 className="card-title">This Month</h5>
            <p className="card-text">{ThisMonthTotal}</p>
            <span>{monthTotalSales} Sales </span>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-6">
            <h5 className="card-title">Yesterday</h5>
            <p className="card-text">{YesterdayTotal}</p>
          </div>
          <div className="col-6">
            <h5 className="card-title">Last Month</h5>
            <p className="card-text">{LastMonthTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardOne;
