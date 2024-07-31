// DeleteDialog.js
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import StyledTextField from './StyledTextField';

const DeleteDialog = ({ open, onClose, onConfirm, message }) => {
  const courseCode = message.slice(-8); 
  const [entered, setEntered] = useState('')
  const handleConfirm = () => {
    if (entered.trim() === courseCode) {
      setEntered('')
      onConfirm(true, '');
    } else {
      setEntered('')
      onConfirm(false, 'wrong code');
    }
    onClose();
  };

  const handleCancel = () => {
    setEntered('')
    onConfirm(false, '');
    onClose();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#693E6A',
      },
      secondary: {
        main: '#FCD3CA'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{message}</Typography>
          <Typography variant="body2">Please enter the course code <b>{courseCode}</b> to confirm</Typography>
          <br/>
          <StyledTextField
            label="Enter Course Code" 
            variant='outlined' 
            type='text'
            value={entered.toUpperCase()}
            onChange={(e) => setEntered(e.target.value)}
            style={{ marginRight: '20px',}}
            size='small'
            sx={{
              color: '#693E6A',
            }}
          />
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

export default DeleteDialog;
