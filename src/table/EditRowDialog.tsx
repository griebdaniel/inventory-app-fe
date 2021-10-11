import { Button, Dialog, DialogActions, DialogContent,  DialogTitle, TextField } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from "react";

interface Props<T> {
  onClose: () => any;
  onSave: (row: T) => any;
  row: T;
  open: boolean;
}

const EditRowDialog = <T extends Record<string, unknown>, >({ onClose, onSave, row: rowInput, open }: Props<T>) => {
  const [row, setRow] = useState({...rowInput});

  useEffect(() => {
    setRow({ ...rowInput });
  }, [rowInput]);

  const handleClose = () => {
    onClose();
  };

  const onValueChange = (value: string, key: string) => {
    setRow({...row, [key]: value });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {_.keys(row).map((key, index) => {
          return (<TextField
            key={index}
            autoFocus
            margin="dense"
            id="name"
            label={key}
            fullWidth
            variant="standard"
            value={row[key]}
            onChange={event => onValueChange(event.target.value, key)}
          />);
        })}

      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSave(row)}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRowDialog;