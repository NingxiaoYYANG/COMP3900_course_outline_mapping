import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './styles/uploadcourse.css';
import { Alert, Button, FormControl, TextField } from '@mui/material';
import BrowseFilesButton from './BrowseFilesButton';
import UploadButton from './UploadButton';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import StyledTextField from './StyledTextField';


function UploadCourse() {
  const [selection, setSelection] = useState('courseOutline');
  const [courseCode, setCourseCode] = useState("");
  const [file, setFile] = useState(null);
  const [examContents, setExamContents] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [bloomsCount, setBloomsCount] = useState(null); 
  const [wordToBloom, setWordToBloom] = useState(null); 
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState('false');
  const [successfulExamUpload, setSuccessfulExamUpload] = useState(false);

  const navigate = useNavigate();
  const dropZoneRef = useRef(null);

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
      return;
    }

    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    if (!codePattern.test(courseCode)) {
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      setShowAlert(true)
      return;
    }

    const formData = new FormData();
    formData.append('course_code', courseCode);
    console.log('Uploading course code:', formData);

    setIsLoading('uploadingCode'); // Start loading

    try {
      const response = await axios.post('/api/upload_course_code', formData);
      if (response.status === 200) {
        setSuccessMessage('Course code uploaded successfully!')
        setShowSuccess(true)
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
      if (error.response && error.response.data.error) {
        //alert(error.response.data.error);  // Display the custom error message in an alert
        const userConfirmation = window.confirm(`Course code ${formData.get("course_code")} already exists. Do you want to replace it?`);
        if (userConfirmation) {
            try {
                // Send DELETE request to remove the existing course code
                await axios.delete(`/api/delete_course`, { data: { course_code: formData.get("course_code") } });
                
                // Attempt to add the new course details again
                const retryResponse = await axios.post('/api/upload_course_code', formData);
                if (retryResponse.status === 200) {
                    alert('Course code replaced successfully!');
                    // Clear form state...
                } else {
                    setError('Failed to replace course code.');
                    setShowAlert(true);
                }
            } catch (deleteError) {
                console.error('Error deleting course code:', deleteError);
                setError('Failed to delete course code. Please try again later.');
                setShowAlert(true);
            }
        } else {
            // User chose not to replace, handle accordingly
            setError('Course code upload cancelled.');
            setShowAlert(true);
        }
    } else {
        setError('Error uploading course code. Please try again later.');
        setShowAlert(true);
    }
    } finally {
      setIsLoading('false'); // End loading
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

    setIsLoading('uploadingPDF'); // Start loading

    try {
      const response = await axios.post('/api/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setSuccessMessage("PDF file uploaded successfully!")
        setShowSuccess(true)
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
      if (error.response && error.response.data.error) {
        //alert(error.response.data.error);  // Display the custom error message in an alert
        const userConfirmation = window.confirm(`Course code ${error.response.data.course_code} already exists. Do you want to replace it?`);
        if (userConfirmation) {
            try {
                // Send DELETE request to remove the existing course code
                const courseCodeToDelete = error.response.data.course_code;
                await axios.delete(`/api/delete_course`, { data: { course_code: courseCodeToDelete } });
                
                // Attempt to add the new course details again
                const retryResponse = await axios.post('/api/upload_pdf', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
                if (retryResponse.status === 200) {
                    alert('Course code replaced successfully!');
                    // Clear form state...
                } else {
                    setError('Failed to replace course code.');
                    setShowAlert(true);
                }
            } catch (deleteError) {
                console.error('Error deleting course code:', deleteError);
                setError('Failed to delete course code. Please try again later.');
                setShowAlert(true);
            }
        } else {
            // User chose not to replace, handle accordingly
            setError('Course code upload cancelled.');
            setShowAlert(true);
        }
    } else {
        setError('Error uploading PDF. Please try again later.');
        setShowAlert(true);
    }
    } finally {
      setIsLoading(false); // End loading
    }
  };
  
  useEffect(() => {
    if (bloomsCount !== null) { // Only navigate if bloomsCount is updated
      setTimeout(() => {
        navigate('/buildexam', { state: { bloomsCount } }); // Pass data to the next page
      }, 2000);
    }
  }, [bloomsCount, navigate]);

  const handleUploadExam = async () => {
    if (!examContents.trim()) {
      setError('Please provide the exam questions.');
      setShowAlert(true);
      return;
    }

    // Validate the exam questions format
    const questions = examContents.trim().split('\n');
    const validFormat = questions.every(q => /^\d+\.\s/.test(q));

    if (!validFormat) {
      setError('Each question must start with a number followed by a period and a space (e.g., 1. Question content).');
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append('exam_contents', examContents);
    console.log('Uploading exam questions:', formData);

    setIsLoading('uploadingExam'); // Start loading

    try {
      const response = await axios.post('/api/upload_exam', formData);
      if (response.status === 200) {
        setSuccessMessage('Exam questions uploaded successfully!')
        setShowSuccess(true)
        setExamContents('');
        setError('');
        setShowAlert(false);
        setBloomsCount(response.data.blooms_count); // Update the state with Bloom's count
        setWordToBloom(response.data.word_to_blooms)
        console.log(response.data.word_to_blooms)
      } else {
        setError('Failed to upload exam questions.');
      }
    } catch (error) {
      console.error('Error uploading exam questions:', error);
      setError('Error uploading exam questions. Please try again later.');
    } finally {
      setIsLoading('false');
      setIsLoading('false');
    }
  }


  const handleAlertClose = () => {
    if (showAlert) {
      setShowAlert(false);
    }
    if (showSuccess) {
      setShowSuccess(false);
    }
  };
  
  const onFileChange = (files) => {
    console.log(files);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUploadCourseCode();
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange({ target: { files: droppedFiles } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`upload-wrapper ${showAlert || showSuccess ? 'alert-active' : ''}`}>
      <div className='container'>
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
              <Alert severity="error" onClose={handleAlertClose} style={{display: showAlert ? 'flex' : 'none'}} className='alert' >
                {error}
              </Alert>
              <Alert severity="success" onClose={handleAlertClose} style={{marginBottom: '20px', marginTop: '-10px', display: showSuccess ? 'flex' : 'none',}} >
                {successMessage}
              </Alert>
              <div
                ref={dropZoneRef}
                className="drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
              >
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <p>Drop file to upload</p>
              <p>or</p>
              <div>
                <BrowseFilesButton handleChange={handleFileChange}/>
                {file === null ? 'No file chosen' : <div>{file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}</div>}

              </div>
              <br />

              {isLoading === 'uploadingPDF' ? (
                <Loader />
              ) : (
                <UploadButton text="Upload PDF" onclick={handleUpload} width='160px'/>
              )}

              <p className='max_size_label'>Max file size: 10MB</p>
              <p className='supported_file_label'>Supported file types: PDF</p>
              <br/>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
              </div>
              
            </div>
            <div className="upload_form" style={{ display: 'flex', justifyContent: 'center' }}>
              <StyledTextField 
                type='text' 
                variant="standard" 
                label="Input course code" 
                size='small' 
                onChange={handleTextChange} 
                onKeyDown={handleKeyPress} 
                style={{ width: '140px', marginRight: '30px' }}
              />
                <br/>
              {isLoading === 'uploadingCode' ? (
                <Loader />
              ) : (
                <UploadButton text="Upload course code" onclick={handleUploadCourseCode} />
              )}
                
            </div>
          </>)}

          {selection === 'examPaper' && (<>
            <Alert severity="error" onClose={handleAlertClose} style={{display: showAlert ? 'flex' : 'none'}} className='alert' >
                {error}
              </Alert>
              <Alert severity="success" onClose={handleAlertClose} style={{marginBottom: '20px', marginTop: '-10px', display: showSuccess ? 'flex' : 'none',}} >
                {successMessage}
              </Alert>
            <div className="upload_form" style={{ minHeight: '430px' }}> 
              <h4>Input Text</h4>
              <StyledTextField
                multiline 
                rows={12} 
                fullWidth 
                value={examContents} 
                onChange={handleExamTextChange} 
                sx={{ marginBottom: '20px'}}
              />

              {isLoading === 'uploadingExam' ? (
                <Loader />
              ) : (
                <UploadButton text="Upload Exam Questions" onclick={handleUploadExam} />
              )}

            </div>
            {/* <div className="upload_form">
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
            </div> */}
            </>
          )}
        </div>
      </div>
    </div>
    
  )
}


export default UploadCourse;
