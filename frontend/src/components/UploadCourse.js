import React from 'react';
import './styles/uploadcourse.css';
import { useState } from 'react';


function UploadCourse() {

  const [selection, setSelection] = useState('courseOutline');
  const handleSelectionChange = (selection) => {
    setSelection(selection);
  }

  return (<>
    <div className="container">
      <div className="container_inner">
        <h1>Upload</h1>
        <div className="button_group">
          <button 
            id="button_outline" 
            className={selection === 'courseOutline' ? 'active' : ''}
            onClick={() => handleSelectionChange('courseOutline')}
          >
            Course Outline
          </button>
          <button 
            id="button_exam" 
            className={selection === 'examPaper' ? 'active' : ''}
            onClick={() => handleSelectionChange('examPaper')}
          >
            Exam Paper
          </button>
        </div>

        {selection === 'courseOutline' && (<div className="upload_form">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drop file to upload</p>
          <p>or</p>
          <button className="button">Browse</button>
          <p className='max_size_label'>Max file size: 10MB</p>
          <p className='supported_file_label'>Supported file types: PDF</p>
        </div>)}

        {selection === 'examPaper' && (
        <>
          <div className="upload_form">
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drop file to upload</p>
            <p>or</p>
            <button className="button">Browse</button>
            <p className='max_size_label'>Max file size: 10MB</p>
            <p className='supported_file_label'>Supported file types: PDF</p>
          </div>
        <div className="upload_form">
          <p>Input Text</p>
          <textarea></textarea>
        </div>
        </>
        )}
        
      </div>
    </div>
  </>)
}

export default UploadCourse;