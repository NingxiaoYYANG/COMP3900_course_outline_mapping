import { useRef } from 'react';

function BrowseFilesButton (props) {
  const fileInputRef=useRef();

  return (
    <div>
      <button 
        onClick={()=>fileInputRef.current.click()}
        style={{
          border: '2px solid #693E6A',
          height: '35px',
          width: '160px',
          borderRadius: '25px',
          backgroundColor: 'white',
          color: '#693E6A',
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