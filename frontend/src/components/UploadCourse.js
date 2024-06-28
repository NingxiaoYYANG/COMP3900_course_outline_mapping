import React, { useState } from 'react';
import axios from 'axios';
// import './styles/uploadcourse.css';


function UploadCourse() {

  const [selection, setSelection] = useState('courseOutline');
  const handleSelectionChange = (selection) => {
    setSelection(selection);
  }

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Invalid file format. Please upload a PDF file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('PDF file uploaded successfully!');
        // Clear form state
        setFile(null);
        setError('');
      } else {
        setError('Failed to upload PDF file.');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('Error uploading PDF. Please try again later.');
    }
  };


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
          <br />
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br />
          <button onClick={handleUpload}>Upload PDF</button>
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