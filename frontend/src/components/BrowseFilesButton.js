import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { useRef } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#372768',
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
          border: '2px solid #372768',
          height: '35px',
          width: '160px',
          borderRadius: '25px',
          backgroundColor: 'white',
          color: '#372768',
          fontSize: '12pt',
          cursor: 'pointer'
        }}
      >
        Browse Files
      </button>
      <input onChange={props.handleChange} ref={fileInputRef} accept='.pdf' type='file' hidden/>
    </div>
  )
}

export default BrowseFilesButton;