import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    primary: {
      main: '#AB1748',
    },
    secondary: {
      main: '#FCD3CA'
    }
  }
})

function TextButton (props) {

  return (
    <ThemeProvider theme={theme}>
      <Button 
        variant="contained" 
        color='primary'
        endIcon={props.text === 'NEXT' ? <ArrowForwardIosNewIcon /> : null}
        startIcon={props.text === 'BACK' ? <ArrowBackIosNewIcon /> : null}>

        {props.text}
      </Button>
  </ThemeProvider>
  )
}

export default TextButton;