import React from 'react';
import { useState, Fragment } from 'react';
import {
  Cell,
  CellProps,
  Column,
  IdType,
  Row,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table';

import EditRowDialog from './EditRowDialog';

import { Box } from '@mui/system';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';

import _ from 'lodash';
import EnhancedTableToolbar from './TableToolbar';
import AddRowDialog from './AddRowDialog';


interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[],
  title: string,
  updateMyData: (rowIndex: number, value: T) => void,
  globalFilter: (rows: Row<T>[], ids: IdType<T>[], query: string) => Row<T>[],
}

const DataTable = <T extends Record<string, unknown>,>({ data, columns, title, updateMyData, globalFilter }: DataTableProps<T>) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [editedRow, setEditedRow] = useState<T>();

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    selectedFlatRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable<T>({
    globalFilter,
    columns,
    data,
    updateMyData
  },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />

          ),
          Cell: ({ row }: CellProps<any>) => (
            <Checkbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const onCellClick = (cell: Cell<T>) => {
    if (cell.column.id !== 'selection') {
      setEditedRow(cell.row.original);
      setOpenEdit(true);
    }
  };

  const getDefaultValues = () => {
    return columns.reduce((pv, cv) => {
      pv[cv.accessor] = null;
      return pv;
    }, {} as any) as T;
  };



  const handleFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleChangePage = (event: any, newPage: any) => {
    console.log(newPage);
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const handleEditCancel = () => {
    setOpenEdit(false);
  };

  const handleEdit = (row: T) => {
    console.log(row);
    setOpenEdit(false);
    updateMyData(selectedFlatRows[0].index, row);
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };

  const handleAdd = (row: T) => {

  };

  const handleAddCancel = () => {
    setOpenAdd(false);
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selectedFlatRows.length} title={title} onAdd={handleAddClick} onFilterChange={handleFilterChange} />
          <EditRowDialog onCancel={handleEditCancel} onSave={handleEdit} row={editedRow!} open={openEdit}></EditRowDialog>
          <AddRowDialog onCancel={handleAddCancel} onAdd={handleAdd} defaultValues={getDefaultValues()} open={openAdd}></AddRowDialog>
          <TableContainer component={Paper}>
            <Table {...getTableProps()} >
              <TableHead>
                <TableRow>
                  {headers.map(column => {
                    return (
                      <TableCell
                        {...(column.id === 'selection'
                          ? column.getHeaderProps()
                          : column.getHeaderProps(column.getSortByToggleProps()))}
                      >
                        {column.render('Header')}
                        {column.canSort ? (
                          <TableSortLabel
                            active={column.isSorted}
                            // react-table has a unsorted state which is not treated here
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                          />
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <TableCell {...cell.getCellProps()} sx={{ cursor: 'pointer' }} onClick={() => onCellClick(cell)}>
                            {cell.render('Cell')}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={data.length}
                    page={pageIndex}
                    rowsPerPage={pageSize}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    showFirstButton={true}
                    showLastButton={true}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Box>


      <Paper></Paper>
    </Fragment>
  );
};


export default DataTable;
