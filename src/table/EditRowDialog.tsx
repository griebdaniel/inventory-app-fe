import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useState } from "react";

interface Props<T> {
  onCancel: () => any;
  onSave: (row: T) => any;
  row: T;
  open: boolean;
}

const EditRowDialog = <T extends Record<string, unknown>,>({ onCancel, onSave, row: rowInput, open }: Props<T>) => {
  const [row, setRow] = useState({ ...rowInput });

  useEffect(() => {
    setRow({ ...rowInput });
  }, [rowInput]);

  const handleValueChange = (key: string) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setRow({ ...row, [key]: value });
  };

  return (
    <Dialog onClose={onCancel} open={open}>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            onChange={handleValueChange(key)}
          />);
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(row)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRowDialog;