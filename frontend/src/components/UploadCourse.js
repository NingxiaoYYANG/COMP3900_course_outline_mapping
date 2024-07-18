import React, { useState } from 'react';
import axios from 'axios';
import './styles/uploadcourse.css';
import { Alert, Button, FormControl, TextField } from '@mui/material';
import BrowseFilesButton from './BrowseFilesButton';
import UploadButton from './UploadButton';


function UploadCourse() {
  const [selection, setSelection] = useState('courseOutline');
  const [courseCode, setCourseCode] = useState("");
  const [file, setFile] = useState(null);
  const [examContents, setExamContents] = useState('');
  const [error, setError] = useState('');
  const [bloomsCount, setBloomsCount] = useState(null); // New state for Bloom's count
  const [showAlert, setShowAlert] = useState(false);

  const handleSelectionChange = (selection) => {
    setSelection(selection);
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setError('');
        setShowAlert(false);
      } else {
        setError('Invalid file format. Please upload a PDF file.');
        setShowAlert(true)
      }
    }
  };

  const handleTextChange = (e) => {
    setCourseCode(e.target.value);
  }

  const handleExamTextChange = (e) => {
    setExamContents(e.target.value);
  }

  const handleUploadCourseCode = async () => {
    if (!courseCode) {
      setError('Please provide the course code.')
      setShowAlert(true)
      // alert('Please provide the course code.')
      return;
    }

    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    if (!codePattern.test(courseCode)) {
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      setShowAlert(true)
      // alert('Please enter course code in correct format (e.g., ABCD1234).')
      return;
    }

    const formData = new FormData();
    formData.append('course_code', courseCode);
    console.log('Uploading course code:', formData);

    try {
      const response = await axios.post('http://127.0.0.1:5000http://127.0.0.1:5000/api/upload_course_code', formData);
      if (response.status === 200) {
        alert('Course code uploaded successfully!');
        // Clear form state
        setCourseCode('');
        setError('');
        setShowAlert(false);
      } else {
        setError('Failed to upload course code.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error uploading course code:', error);
      setError('Error uploading course code. Please try again later.');
      setShowAlert(true)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      setShowAlert(true)
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log('Uploading PDF:', formData);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('PDF file uploaded successfully!');
        // Clear form state
        setFile(null);
        setError('');
        setShowAlert(false);
      } else {
        setError('Failed to upload PDF file.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('Error uploading PDF. Please try again later.');
      setShowAlert(true)
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
  const handleAlertClose = () => {
    setShowAlert(false);
  };
  

  return (
    <div className="container">
      <div className="container_inner">
        <div style={{ display: 'flex', alignItems:'center', marginTop: '-15px'}}>
          <h1 >Upload</h1>
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

        

        {selection === 'courseOutline' && (<>
          
          <div className="upload_form">
            <Alert severity="error" onClose={handleAlertClose} style={{marginBottom: '20px', marginTop: '-10px', display: showAlert ? 'flex' : 'none'}} >
              {error}
            </Alert>
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drop file to upload</p>
          <p>or</p>
          <div>
            <BrowseFilesButton handleChange={handleFileChange}/>
            {file === null ? 'No file chosen' : file.name}
          </div>
          {/* <input type="file" accept=".pdf" onChange={handleFileChange} /> */}
          <br />
          <UploadButton text="Upload PDF" onclick={handleUpload} width='160px'/>
          {/* <Button variant='contained' onClick={handleUpload}>Upload PDF</Button> */}

          <p className='max_size_label'>Max file size: 10MB</p>
          <p className='supported_file_label'>Supported file types: PDF</p>
          <br/>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
          </div>
          
        </div>
        <div className="upload_form" style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField type='text' variant="standard" label="Input course code" size='small' onChange={handleTextChange} style={{ width: '140px', marginRight: '30px' }}/>
            <br/>
            <UploadButton text="Upload course code" onclick={handleUploadCourseCode} />
        </div>
      </>)}

        {selection === 'examPaper' && (<>
          <div className="upload_form">
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drop file to upload</p>
            <p>or</p>
            <BrowseFilesButton handleChange={handleFileChange}/>
            <p className='max_size_label'>Max file size: 10MB</p>
            <p className='supported_file_label'>Supported file types: PDF</p>
          </div>
        <div className="upload_form">
          {/* Input Text */}
          <p>Input Text</p>
          <TextField multiline rows={2} maxRows={3} fullWidth value={examContents} onChange={handleExamTextChange} sx={{ marginBottom: '20px'}} />
          {/* <textarea></textarea> */}
          <UploadButton text="Upload Exam Questions" onclick={handleUploadExam} />
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
  )
}


export default UploadCourse;
