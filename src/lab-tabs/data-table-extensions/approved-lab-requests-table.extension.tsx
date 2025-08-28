import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const approvedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="COMPLETED"
      excludeColumns={[]}
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
    />
  );
};

export default approvedLabRequestsTable;
