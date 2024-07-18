import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SelectField = ({ label, id, value, onChange, options }) => {
  return (
    <FormControl fullWidth className='filter-box' style={{ marginBottom: '15px' }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
