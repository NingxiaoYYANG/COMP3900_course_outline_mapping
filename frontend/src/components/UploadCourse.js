import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './styles/uploadcourse.css';
import { Alert, Button, FormControl, Snackbar, TextField } from '@mui/material';
import BrowseFilesButton from './BrowseFilesButton';
import UploadButton from './UploadButton';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import StyledTextField from './StyledTextField';
import ConfirmationDialog from './ConfirmationDialog';


function UploadCourse() {
  const [selection, setSelection] = useState('courseOutline');
  const [courseCode, setCourseCode] = useState("");
  const [file, setFile] = useState(null);
  const [examContents, setExamContents] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [bloomsCount, setBloomsCount] = useState(null); // New state for Bloom's count
=======
  const [successMessage, setSuccessMessage] = useState('')
  const [bloomsCount, setBloomsCount] = useState(null); 
>>>>>>> f0ff48f7c5c77ce8b80d79b0f55b9b88b89816f1
  const [wordToBloom, setWordToBloom] = useState(null); 
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState('false');
  const [successfulExamUpload, setSuccessfulExamUpload] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

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
        setShowAlert(false);
        setSuccessMessage('Course code uploaded successfully!')
        setShowSuccess(true)
        // Clear form state
        setCourseCode('');
        setError('');
      } else {
        setError('Failed to upload course code.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error uploading course code:', error);
      if (error.response && error.response.data.error) {
        setDialogMessage(`Course code ${formData.get("course_code")} already exists. Do you want to replace it?`);
        setOnConfirmAction(() => async (confirm) => {
          if (confirm) {
            try {
              await axios.delete(`/api/delete_course`, { data: { course_code: formData.get("course_code") } });
              const retryResponse = await axios.post('/api/upload_course_code', formData);
              if (retryResponse.status === 200) {
                setShowAlert(false);
                setSuccessMessage('Course code uploaded successfully!')
                setShowSuccess(true)
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
            setError('Course code upload cancelled.');
            setShowAlert(true);
          }
        });
        setDialogOpen(true);
      }
      else {
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
        
        setDialogMessage(`Course code ${error.response.data.course_code} already exists. Do you want to replace it?`);
        setOnConfirmAction(() => async (confirm) => {
          if (confirm) {
            try {
              const courseCodeToDelete = error.response.data.course_code;
              await axios.delete(`/api/delete_course`, { data: { course_code: courseCodeToDelete } });
              const retryResponse = await axios.post('/api/upload_pdf', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              if (retryResponse.status === 200) {
                setSuccessMessage('Course code uploaded successfully!')
                setShowSuccess(true)
                setFile(null);
                setError('');
                setShowAlert(false);
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
            setError('Course code upload cancelled.');
            setShowAlert(true);
          }
        });
        setDialogOpen(true);
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
        console.log(examContents)
        navigate('/buildexam', { state: { bloomsCount, examContents } }); // Pass data to the next page
        setExamContents('');
      }, 1500);
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
        setSuccessMessage('Exam questions uploaded successfully!');
        setShowSuccess(true);
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

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccess(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUploadCourseCode();
    }
  }

<<<<<<< HEAD
=======
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

>>>>>>> f0ff48f7c5c77ce8b80d79b0f55b9b88b89816f1
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
            <div className="upload_form" > 
              <h4>Input Text</h4>
              <StyledTextField
                multiline 
                rows={14} 
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
            </>
          )}
          <Snackbar
            open={showAlert}
            autoHideDuration={3000}
            onClose={handleErrorClose}
            message={error}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{marginTop: '80px'}}
          >
            <Alert severity="error" onClose={handleErrorClose} variant="filled" className='alert' >
              {error}
            </Alert>
          </Snackbar>
          <Snackbar
            open={showSuccess}
            autoHideDuration={3000}
            onClose={handleSuccessClose}
            message={successMessage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{marginTop: '80px'}}
          >
            <Alert severity="success" onClose={handleSuccessClose} variant="filled" >
              {successMessage}
            </Alert>
          </Snackbar>
        </div>
        <ConfirmationDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={onConfirmAction}
          message={dialogMessage}
        />
      </div>
    </div>
    
  )
}


export default UploadCourse;
