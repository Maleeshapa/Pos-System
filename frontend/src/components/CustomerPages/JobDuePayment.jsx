import React, { useState } from 'react';
import Table from '../Table/Table'

const JobDuePayment = () => {

  const [data,] = useState([
    [],
  ]);
  const Columns = ["Job Id", 'Job Date', 'Customer', 'Invoice Amount','Due Amount','Creadit Age'];

  return (
    <div>
      <div className="scrolling-container">
        <h4>JobDuePayment</h4>
        <Table
            data={data}
            columns={Columns}
            showButton={false}
          />
      </div>
    </div>
  )
}

export default JobDuePayment