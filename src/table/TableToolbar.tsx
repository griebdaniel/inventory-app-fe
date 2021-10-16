import { Add } from "@mui/icons-material";
import { Toolbar, Typography, TextField, IconButton, Tooltip } from "@mui/material";
import { alpha, Box } from "@mui/system";
import { useState, Fragment } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onAdd: () => void;
  onFilterChange: (value: string) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, title, onFilterChange, onAdd } = props;
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
    onFilterChange(event.target.value);
  };

  const handleAddClick = () => {
    onAdd();
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
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Fragment>
      ) : (
        <Fragment>
          <IconButton>
            <Add onClick={handleAddClick}/>
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

export default EnhancedTableToolbar;