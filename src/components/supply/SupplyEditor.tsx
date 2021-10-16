import { useCallback, useEffect, useMemo, useState } from "react";
import { Column, IdType, Row } from "react-table";
import Supply from "../../models/supply";
import DataTable from "../../table/Table";
import getSupplies from "./makeSupplies";

// import _ from 'lodash';
// { name: 'aluminium', quantity: 2, unit: 'dkg' },
// { name: 'iron', quantity: 3, unit: 'g' },
// { name: 'szilver', quantity: 6, unit: 'kg' },
// { name: 'gold', quantity: 4, unit: 'piece' }
const SupplyEditor = (props: any) => {
  const [supplies, setSupplies] = useState<Array<Supply>>();

  useEffect(() => {
    setSupplies(getSupplies(150));
  }, []);

  const columns = useMemo<Column<Supply>[]>(() => [
    { Header: 'Name', accessor: 'name', },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Unit', accessor: 'unit', disableSortBy: true  }
  ], []);

  const globalFilterFunction = useCallback(
    (rows: Row<Supply>[], ids: IdType<Supply>[], query: string) => {
        console.log(query);
        return rows.filter((row) => 
          row.original.name.includes(query)  
        );
    },
    [],
);


  const updateMyData = (rowIndex: number, value: Supply) => {
    // We also turn on the flag to not reset the page
    setSupplies(old =>
      old?.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...value
          };
        }
        return row;
      })
    );
  };

  return (
    <div style={{ width: 600, margin: 20 }}>
      {supplies && <DataTable title="Supplies" data={supplies} columns={columns} globalFilter={globalFilterFunction}  updateMyData={updateMyData}  />}
    </div>
  );
};


export default SupplyEditor;