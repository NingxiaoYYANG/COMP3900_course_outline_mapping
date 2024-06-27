import React, { useState } from 'react';
import axios from 'axios';

function UploadCourse() {
  const [courseCode, setCourseCode] = useState('');
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
    formData.append('course_code', courseCode);
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
        setCourseCode('');
        setFile(null);
        setError('');
      } else {
        setError('Failed to upload PDF file.');
      }
    } catch (error) {
      console.log(error)
      console.error('Error uploading PDF:', error);
      setError('Error uploading PDF. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Upload Course Outline PDF</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Course Code:
        <input
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
      </label>
      <br />
      <label>
        Select PDF File:
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </label>
      <br />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}

export default UploadCourse;
