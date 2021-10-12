import React from 'react';
import { useState, Fragment } from 'react';
import { Cell, CellProps, Column, ColumnInstance, HeaderProps, IdType, Row, TableHeaderProps, useGlobalFilter, useRowSelect, useSortBy, useTable } from 'react-table';
import EditRowDialog from './EditRowDialog';

import { alpha, Box, darken, flexbox } from '@mui/system';
import { Checkbox, ClickAwayListener, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableProps, TableRow, TableRowProps, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { responsiveFontSizes } from '@material-ui/core';
import { Add, ConstructionOutlined, Edit } from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';

import _ from 'lodash';




interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onEdit: () => void;
  onFilterChange: (value: string) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, title, onEdit, onFilterChange } = props;
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
    onFilterChange(event.target.value);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) :
        <Box sx={{ flex: '1 1 100%' }}>
          {filterOpen ? (
            <TextField label="Filter" variant="standard" value={filterValue} onChange={handleFilterChange}>
            </TextField>
          ) : (
            <Typography
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {title}
            </Typography>
          )}
        </Box>
      }
      {numSelected > 0 ? (
        <Fragment>
          {numSelected === 1 &&
            <IconButton onClick={onEdit}>
              <Edit />
            </IconButton>
          }
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Fragment>
      ) : (
        <Fragment>
          <IconButton>
            <Add />
          </IconButton>
          <Tooltip title="Filter list">
            <IconButton onClick={toggleFilter}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Fragment>

      )}
    </Toolbar>
  );
};

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  cell,
  opened,
  onSave,
  onClose
}: CellProps<any>) => {

  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    onSave(value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onKeyPress = (event: React.KeyboardEvent<any>) => {
    console.log(event.key);
    if (event.key === 'Enter') {
      onSave(value);
    }
    if (event.key === 'Esc') {
      onClose();
    }
  };

  return (
    <Fragment>
      {opened ?
        <TextField variant="standard" onChange={event => setValue(event.target.value)} onKeyPress={onKeyPress} value={value} /> :
        <Fragment> {value} </Fragment>
      }
    </Fragment>
  );
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[],
  title: string,
  updateMyData: (rowIndex: number, value: T) => void,
  globalFilter: (rows: Row<T>[], ids: IdType<T>[], query: string) => Row<T>[]
}

const DataTable = <T extends Record<string, unknown>,>({ data, columns, title, updateMyData, globalFilter }: DataTableProps<T>) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [currentRow, setCurretnRow] = useState<T>();
  const [editedCell, setEditedCell] = useState<Cell<T> | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleRowSelected,
    setGlobalFilter,
    state: { selectedRowIds }
  } = useTable<T>({
    globalFilter,
    columns,
    data,
    defaultColumn,
    updateMyData
  },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox onClick={event => event.stopPropagation()} color="primary" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }: CellProps<any>) => (
            <Checkbox onClick={event => event.stopPropagation()} color="primary" {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const onCellClick = (cell: Cell<T>) => {
    toggleRowSelected(cell.row.id);
  };

  const onEditRowCancel = () => {
    setIsEditDialogOpen(false);
  };

  const onSaveRow = (row: T) => {
    console.log(row);
    setIsEditDialogOpen(false);
    updateMyData(selectedFlatRows[0].index, row);
  };

  const handleFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selectedFlatRows.length} title={title} onEdit={() => setIsEditDialogOpen(true)} onFilterChange={handleFilterChange} />
          <EditRowDialog onCancel={() => setIsEditDialogOpen(false)} onSave={onSaveRow} row={selectedFlatRows[0]?.original} open={isEditDialogOpen}></EditRowDialog>
          <TableContainer component={Paper}>
            <Table {...getTableProps()} >
              <TableHead>
                <TableRow>
                  {headers.map(column => {
                    return (
                      <TableCell
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        sortDirection={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : false}
                      >
                        {column.canSort ? (
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                          >
                            {column.render('Header')}
                          </TableSortLabel>) : (<React.Fragment>{column.render('Header')}</React.Fragment>)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()} selected={row.isSelected}>
                      {row.cells.map(cell => {
                        return (
                          <TableCell sx={{ cursor: 'pointer', position: 'relative' }} onClick={() => onCellClick(cell)} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </TableCell>);
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>


      <Paper></Paper>
    </Fragment>
  );
};


export default DataTable;
