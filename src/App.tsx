import React, { useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import DataTable from './table/Table';
import { Column } from 'react-table';




function App() {
  const data = useMemo<object[]>(() => [
    { name: 'supply1', quantity: 2 },
    { name: 'supply2', quantity: 3 }
  ], []);

  const columns = useMemo<Column<object>[]>(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Quantity', accessor: 'quantity' }
  ], []);

  return (
    <div style={{ width: 400, margin: 20 }}>
      <DataTable data={data} columns={columns} />
    </div>

  );
}

export default App;
