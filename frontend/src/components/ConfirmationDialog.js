// ConfirmationDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  const handleConfirm = () => {
    onConfirm(true);
    onClose();
  };

  const handleCancel = () => {
    onConfirm(false);
    onClose();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#693E6A',
      },
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConfirmationDialog;
