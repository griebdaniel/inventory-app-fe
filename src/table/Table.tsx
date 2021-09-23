import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { Column, useTable } from 'react-table';

const DataTable = ({ data, columns }: { data: object[], columns: Column<object>[] }) => {

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {headers.map(column => (
            <TableCell>{column.render('Header')}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                })}
                <TableCell>
                  <IconButton size="small"> <Edit fontSize="inherit"/> </IconButton>
                  <IconButton size="small"> <Delete fontSize="inherit"/> </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


export default DataTable;
