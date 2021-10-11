import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import Supply from "../../models/supply";
import DataTable from "../../table/Table";

const SupplyEditor = (props: any) => {
  const [supplies, setSupplies] = useState<Supply[]>();


  useEffect(() => {
    setSupplies([
      { name: 'aluminium', quantity: 2, unit: 'dkg' },
      { name: 'iron', quantity: 3, unit: 'g' },
      { name: 'szilver', quantity: 6, unit: 'kg' },
      { name: 'gold', quantity: 4, unit: 'piece' }
    ]);
  }, []);

  const columns = useMemo<Column<any>[]>(() => [
    { Header: 'Name', accessor: 'name', },
    { Header: 'Quantity', accessor: 'quantity' },
    { Header: 'Unit', accessor: 'unit', disableSortBy: true  }
  ], []);


  const updateMyData = (rowIndex: number, columnId: string, value: any) => {
    // We also turn on the flag to not reset the page
    setSupplies(old =>
      old?.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  return (
    <div style={{ width: 400, margin: 20 }}>
      {supplies && <DataTable title="Supplies" data={supplies!} columns={columns}  updateMyData={updateMyData}  />}
    </div>
  );
};


export default SupplyEditor;