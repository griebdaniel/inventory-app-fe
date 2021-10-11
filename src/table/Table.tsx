import React from 'react';
import { useState, Fragment } from 'react';
import { Cell, CellProps, Column, ColumnInstance, HeaderProps, TableHeaderProps, useRowSelect, useSortBy, useTable } from 'react-table';
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


interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[],
  title: string,
  updateMyData: (rowIndex: number, columnId: string, value: any) => void
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onEdit: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, title, onEdit } = props;

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
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
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
            <IconButton>
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

const DataTable = <T extends Record<string, unknown>,>({ data, columns, title, updateMyData }: DataTableProps<T>) => {
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
    state: { selectedRowIds }
  } = useTable<T>({
    columns,
    data,
    defaultColumn,
    updateMyData
  },
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

  const isCellEdited = (cell: Cell<T>) => {
    return cell.column.id === editedCell?.column.id && cell.row.id === editedCell.row.id;
  };

  const openEditRowDialog = (row: T) => {
    // setCurretnRow({ ...row });
    // setIsEditDialogOpen(true);
  };

  const onCellClick = (cell: Cell<T>) => {
    // console.log(cell, editedCell);
    if (cell.column.id === 'selection') {
      return;
    }
    // if (cell.column.id === editedCell?.column.id && cell.row.id === editedCell.row.id) {
    //   console.log('equals');
    // }
    // if (editedCell === null) {

    // }
    setEditedCell({ ...cell });
  };

  const onSave = (value: any) => {
    if (editedCell) {
      updateMyData(editedCell.row.index, editedCell.column.id, value);
    }
    setEditedCell(null);
  };

  const onClose = () => {
    setEditedCell(null);
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selectedFlatRows.length} title={title} onEdit={() => setIsEditDialogOpen(true)} />
          <EditRowDialog onClose={() => setIsEditDialogOpen(false)} onSave={newRow => console.log(newRow)} row={currentRow as any} open={isEditDialogOpen}></EditRowDialog>
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
                    <TableRow onClick={() => openEditRowDialog(row.original)} {...row.getRowProps()} selected={row.isSelected}>
                      {row.cells.map(cell => {
                        return (
                          <TableCell sx={{ cursor: 'pointer', position: 'relative' }} onClick={() => onCellClick(cell)} {...cell.getCellProps()}>
                            {isCellEdited(cell) &&
                              <ClickAwayListener onClickAway={() => setEditedCell(null)}>
                                <Paper sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                                  <Box elevation={4} component={Paper} sx={{ p: 3, position: 'fixed', width: 140, bgcolor: darken('#ffff', 0.02) }}>
                                    {cell.render('Cell', { opened: isCellEdited(cell), onSave, onClose })}
                                  </Box>
                                </Paper>
                              </ClickAwayListener>
                            }
                            {cell.render('Cell', { opened: false, onSave, onClose })}
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
