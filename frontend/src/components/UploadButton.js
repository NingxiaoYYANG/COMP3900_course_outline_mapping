import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5E475C',
    },
    secondary: {
      main: '#FCD3CA'
    }
  }
})

function UploadButton (props) {
  return (
    <ThemeProvider theme={theme}>
      <Button onClick={props.onclick} variant='contained' color='primary' style={{ width: props.width }}>
        {props.text}
      </Button>
    </ThemeProvider>
  )
}

export default UploadButton;