import { useRef } from 'react';

function BrowseFilesButton (props) {

  const fileInputRef=useRef();

  return (
    <div>
      <button 
        onClick={()=>fileInputRef.current.click()}
        style={{
          border: '2px solid #5E475C',
          height: '35px',
          width: '160px',
          borderRadius: '25px',
          backgroundColor: 'white',
          color: '#5E475C',
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