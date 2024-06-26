import React from 'react';
import './styles/uploadcourse.css';


function UploadCourse() {

  return (<>
    <div className="container">
      <div className="container_inner">
        <h1>Upload</h1>
        <div className="button_group">
          <button className="button_outline">Course Outline</button>
          <button className="button_exam">Exam Paper</button>
        </div>
        <div className="upload_form">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drop file to upload</p>
          <p>or</p>
          <button className="button">Browse</button>
          <p className='max_size_label'>Max file size: 10MB</p>
          <p className='supported_file_label'>Supported file types: PDF</p>
        </div>
      </div>
    </div>
  </>)
}

export default UploadCourse;