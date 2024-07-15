import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { useRef } from 'react';

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

function BrowseFilesButton (props) {

  const fileInputRef=useRef();

  return (
    <div>
      <button 
        onClick={()=>fileInputRef.current.click()}
        style={{
          border: '3px solid #AB1748',
          height: '40px',
          width: '170px',
          borderRadius: '25px',
          backgroundColor: 'white',
          color: '#AB1748',
          fontSize: '12pt'
        }}
      >
        Browse Files
      </button>
      <input onChange={props.handleChange} ref={fileInputRef} accept='.pdf' type='file' hidden/>
    </div>
  )
}

export default BrowseFilesButton;