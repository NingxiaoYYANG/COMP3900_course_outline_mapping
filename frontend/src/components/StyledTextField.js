import { styled, TextField } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: 'grey' // Default label color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'grey', // Default border color
    },
    '&:hover fieldset': {
      borderColor: 'black', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#48974F', // Border color when focused
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#48974F', // Label color when focused
  },
  '& .MuiInput-underline': {
    '&:before': {
      borderBottomColor: '#000', // Default underline color
    },
    '&:hover:before': {
      borderBottomColor: '#48974F', // Underline color on hover
    },
    '&:after': {
      borderBottomColor: '#48974F', // Underline color when focused
    },
  },
}))

export default StyledTextField;