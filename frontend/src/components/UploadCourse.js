import React, { useState } from 'react';
import axios from 'axios';
import './styles/uploadcourse.css';

function UploadCourse() {
  const [selection, setSelection] = useState('courseOutline');
  const [courseCode, setCourseCode] = useState("");
  const [file, setFile] = useState(null);
  const [examContents, setExamContents] = useState('');
  const [error, setError] = useState('');
  const [bloomsCount, setBloomsCount] = useState(null); // New state for Bloom's count

  const handleSelectionChange = (selection) => {
    setSelection(selection);
  }

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

  const handleTextChange = (e) => {
    setCourseCode(e.target.value);
  }

  const handleExamTextChange = (e) => {
    setExamContents(e.target.value);
  }

  const handleUploadCourseCode = async (e) => {
    if (!courseCode) {
      setError('Please provide the course code.')
      alert('Please provide the course code.')
      return;
    }

    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    if (!codePattern.test(courseCode)) {
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      alert('Please enter course code in correct format (e.g., ABCD1234).')
      return;
    }

    const formData = new FormData();
    formData.append('course_code', courseCode);
    console.log('Uploading course code:', formData);

    try {
      const response = await axios.post('/api/upload_course_code', formData);
      if (response.status === 200) {
        alert('Course code uploaded successfully!');
        // Clear form state
        setCourseCode('');
        setError('');
      } else {
        setError('Failed to upload course code.');
      }
    } catch (error) {
      console.error('Error uploading course code:', error);
      setError('Error uploading course code. Please try again later.');
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log('Uploading PDF:', formData);

    try {
      const response = await axios.post('/api/upload_pdf', formData, {
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

  const handleUploadExam = async () => {
    if (!examContents.trim()) {
      setError('Please provide the exam questions.');
      alert('Please provide the exam questions.');
      return;
    }

    // Validate the exam questions format
    const questions = examContents.trim().split('\n');
    const validFormat = questions.every(q => /^\d+\.\s/.test(q));

    if (!validFormat) {
      setError('Each question must start with a number followed by a period and a space (e.g., 1. Question content).');
      alert('Each question must start with a number followed by a period and a space (e.g., 1. Question content).');
      return;
    }

    const formData = new FormData();
    formData.append('exam_contents', examContents);
    console.log('Uploading exam questions:', formData);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upload_exam', formData);
      if (response.status === 200) {
        alert('Exam questions uploaded successfully!');
        // Clear form state
        setExamContents('');
        setError('');
        setBloomsCount(response.data.blooms_count); // Update the state with Bloom's count
      } else {
        setError('Failed to upload exam questions.');
      }
    } catch (error) {
      console.error('Error uploading exam questions:', error);
      setError('Error uploading exam questions. Please try again later.');
    }
  }

  return (
    <div className="container">
      <div className="container_inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>Upload</h1>
          <div className="button_group">
            <button 
              id="button_outline" 
              className={selection === 'courseOutline' ? 'active' : ''}
              onClick={() => handleSelectionChange('courseOutline')}
            >
              <b>Course Outline</b>
            </button>
            <button 
              id="button_exam" 
              className={selection === 'examPaper' ? 'active' : ''}
              onClick={() => handleSelectionChange('examPaper')}
            >
              <b>Exam Paper</b>
            </button>
          </div>
        </div>

        {selection === 'courseOutline' && (
          <div className="upload_form">
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drop file to upload</p>
            <p>or</p>
            <br />
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <br />
            <input type="text" onChange={handleTextChange} />
            <br />
            <button onClick={handleUpload}>Upload PDF</button>
            <button onClick={handleUploadCourseCode}>Upload by Course Code</button>
            <p className='max_size_label'>Max file size: 10MB</p>
            <p className='supported_file_label'>Supported file types: PDF</p>
          </div>
        )}

        {selection === 'examPaper' && (
          <>
            <div className="upload_form">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drop file to upload</p>
              <p>or</p>
              <input type="file" accept=".pdf" onChange={handleFileChange} />
              <p className='max_size_label'>Max file size: 10MB</p>
              <p className='supported_file_label'>Supported file types: PDF</p>
            </div>
            <div className="upload_form">
              <p>Input Text</p>
              <textarea value={examContents} onChange={handleExamTextChange}></textarea>
              <br />
              <button onClick={handleUploadExam}>Upload Exam Questions</button>
            </div>
            {bloomsCount && (
              <div className="blooms_count">
                <h3>Bloom's Taxonomy Count:</h3>
                <ul>
                  {Object.entries(bloomsCount).map(([level, count]) => (
                    <li key={level}>{`${level}: ${count}`}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadCourse;
