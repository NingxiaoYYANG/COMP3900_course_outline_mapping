import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';

const StyledForm = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: 'grey', // Default label color
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#48974F', // Label color when focused
  },
  // Style for the outlined Select component
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'grey', // Default border color
    },
    '&:hover fieldset': {
      borderColor: '#000', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#48974F', // Border color when focused
    },
  },
  '& .MuiSelect-icon': {
    color: '#48974F', // Icon color
  },
}));

// Styled MenuItem component
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: '#d4edda', // Light green background for selected item
    '&:hover': {
      backgroundColor: '#c3e6cb', // Slightly darker green on hover
    },
  },
  '&:hover': {
    backgroundColor: '#c3e6cb', // Green background on hover
  },
}));

const SelectField = ({ label, id, value, onChange, options }) => {
  return (
    <StyledForm fullWidth className='filter-box' style={{ marginBottom: '15px' }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
      >
        <StyledMenuItem value="">All</StyledMenuItem>
        {options.map((option) => (
          <StyledMenuItem key={option} value={option}>{option}</StyledMenuItem>
        ))}
      </Select>
    </StyledForm>
  );
};

export default SelectField;
