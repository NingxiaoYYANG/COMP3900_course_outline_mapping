import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import './styles/courseoutlines.css'
import TextButton from './TextButton';
import { Alert, Button, IconButton, InputAdornment, MenuItem, Popover, Select, Snackbar, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SelectField from './SelectField';
import StyledTextField from './StyledTextField';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteDialog from './DeleteDialog';


function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [classifyResults, setClassifyResults] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate()
  // pagination hooks
  const [currentPage, setCurrentPage] = useState(1); // Default to first page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set how many items you want per page

  // Initialize state to keep track of selected courses
  const [selectedCourses, setSelectedCourses] = useState({});

  const handleAddCourseCode = (e, code) => {
    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    const checked = e.target.checked;
    setSelectedCourses(prevState => ({
      ...prevState,
      [code]: checked, // Toggle the selected state for this specific course code
    }));
    if (!codePattern.test(code)) {
      console.log(code)
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      return;
    }
    if (checked && !courseCodes.includes(code)) {
      setCourseCodes([...courseCodes, code])
    } else if (!checked &&courseCodes.includes(code)) {
      setCourseCodes(courseCodes.filter(c => c !== code));
    }
    setError('');
  };

  const handleDeleteCourse = async (course_code) => {
    setDialogMessage(`Are you sure you want to delete ${course_code}`);
    setOnConfirmAction(() => async (confirm, message) => {
      if (confirm) {  
        try {
          const response = await axios.delete('/api/delete_course', { data: { course_code } });
          if (response.status === 200) {
            setSuccessMessage('Course code deleted successfully!')
            setShowSuccess(true)
            // Remove the deleted course from the state
            setCourseDetails(courseDetails.filter(course => course.course_code !== course_code));
          } else {
            setError('Failed to delete course.');
            setShowError(true)
          }
        } catch (error) {
          setErrorMessage('Error deleting course. Please try again later.');
          setShowError(true)
        }
      } else if (message === 'wrong code') {
        setErrorMessage('Entered incorrect course code. Failed to delete course.')
        setShowError(true)
      } else {
        console.log('Course deletion cancelled');
      }
    });
    setDialogOpen(true);
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get('/api/courses');
      console.log(response)
      setCourseDetails(response.data.course_details);
    } catch (err) {
      setError('Error fetching course details. Please try again.');
      setClassifyResults(null);
    }
  }

  const handleFetchClassifyResults = async () => {
    if (courseCodes.length === 0) {
      setError('Please add at least one course code.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('course_codes', JSON.stringify(courseCodes));

      const response = await axios.post('/api/classify_clos', formData);
      // console.log(response)
      setClassifyResults(response.data.classify_results);
      setError('');
      return response.data.classify_results;
    } catch (err) {
      setError('Error fetching Bloom\'s taxonomy counts. Please try again.');
      setClassifyResults(null);
      return null
    }
  };

  React.useEffect(() => {
    fetchCourseDetails();
  }, []); 

  const handleClick = async () => {
    const classifyResults = await handleFetchClassifyResults();
    console.log('classifyResults before navigating:', classifyResults);
    if (classifyResults) {
      console.log('here')
      navigate('/courseoutlines/builddegree', { state: { classifyResults: classifyResults,  } });  // Pass data to the next page
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value)
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

    setShowError(false);
  };
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('');
  const [selectedDeliveryFormat, setSelectedDeliveryFormat] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStudyLevel, setSelectedStudyLevel] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');

  const uniqueTerms = [...new Set(courseDetails.map(course => course.course_term))].sort();
  const uniqueDeliveryMode = [...new Set(courseDetails.map(course => course.delivery_mode))].sort();
  const uniqueDeliveryFormat = [...new Set(courseDetails.map(course => course.delivery_format))].sort();
  const uniqueLocation = [...new Set(courseDetails.map(course => course.delivery_location))].sort();
  const uniqueFaculty = [...new Set(courseDetails.map(course => course.faculty))].sort();
  const uniqueStudyLevel = [...new Set(courseDetails.map(course => course.course_level))].sort();
  const uniqueCampus = [...new Set(courseDetails.map(course => course.campus))].sort();

  const filteredCourseDetails = courseDetails.filter((detail) => {
    const matchesSearchQuery = detail.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detail.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTerm = selectedTerm === '' || detail.course_term === selectedTerm;
    const matchesDeliveryMode = selectedDeliveryMode === '' || detail.delivery_mode === selectedDeliveryMode;
    const matchesDeliveryFormat = selectedDeliveryFormat === '' || detail.delivery_format=== selectedDeliveryFormat;
    const matchesLocation = selectedLocation === '' || detail.delivery_location === selectedLocation;
    const matchesFaculty = selectedFaculty === '' || detail.faculty === selectedFaculty;
    const matchesStudyLevel = selectedStudyLevel === '' || detail.course_level === selectedStudyLevel;
    const matchesCampus = selectedCampus === '' || detail.campus === selectedCampus;

    return matchesSearchQuery && matchesTerm && matchesDeliveryMode && matchesDeliveryFormat && matchesLocation && matchesFaculty && matchesStudyLevel && matchesCampus;
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  // PAGINATION STUFF
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourseDetails.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCourseDetails.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const nextPage = () => {
    setCurrentPage(prevPageNumber => prevPageNumber + 1);
  };
  
  const prevPage = () => {
    setCurrentPage(prevPageNumber => prevPageNumber - 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <div className='courseoutline-wrapper'>
      <div className='courseoutline-container'>
          <div className='course-title-content'>
            <div className='course-title'>Course Outlines</div>
            <div className='filter-button-container'>
            <Button variant="text" aria-describedby={id} onClick={handlePopClick} sx={{ color: 'grey', borderRadius: '30%', }}>
              <FilterListIcon />
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <div className='box'>
                  <h5 className="search-bar-filter">Search</h5>
                  <div className="search-bar-filter">
                    <StyledTextField
                      label="Search by code or name" 
                      variant='outlined' 
                      type='text'
                      value={searchQuery}
                      onChange={handleSearchQueryChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  </div>
                  <h5>Filter</h5>
                    <SelectField
                      label="Term"
                      id="term-select"
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      options={uniqueTerms}
                    />
                    <SelectField
                      label="Delivery Mode"
                      id="deliveryMode-select"
                      value={selectedDeliveryMode}
                      onChange={(e) => setSelectedDeliveryMode(e.target.value)}
                      options={uniqueDeliveryMode}
                    />
                    <SelectField
                      label="Delivery Format"
                      id="deliveryFormat-select"
                      value={selectedDeliveryFormat}
                      onChange={(e) => setSelectedDeliveryFormat(e.target.value)}
                      options={uniqueDeliveryFormat}
                    />
                    <SelectField
                      label="Location"
                      id="location-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      options={uniqueLocation}
                    />
                    <SelectField
                      label="Faculty"
                      id="faculty-select"
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      options={uniqueFaculty}
                    />
                    <SelectField
                      label="Study Level"
                      id="studyLevel-select"
                      value={selectedStudyLevel}
                      onChange={(e) => setSelectedStudyLevel(e.target.value)}
                      options={uniqueStudyLevel}
                    />
                    <SelectField
                      label="Campus"
                      id="campus-select"
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      options={uniqueCampus}
                    />
                  </div>
              </Popover>
              <div className="search-bar" style={{justifySelf: 'flex-end'}}>
                <StyledTextField
                  label="Search by code or name" 
                  variant='outlined' 
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  style={{ marginRight: '20px',}}
                  size='small'
                  sx={{
                    color: '#693E6A',
                  }}
                />
              </div>
              <TextButton text='NEXT' handleclick={handleClick}/>
            </div>
          </div>
          <div style={{fontSize: '10pt', color: error ? 'red' : courseCodes.length === 0 ? '#fff' : '#693E6A'}}>
            {error || `Selected ${courseCodes.length} outlines...`}
          </div>
          <div className='course-horizontalline'></div>

          {courseDetails.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '165px' }}>
              <i className="fa-solid fa-file"></i>
              <p>No course outlines available.</p>
              <p><Link to='/'>Upload</Link> some!</p>
            </div>
          ) : (
            <>
            <div className='courseoutline-selection-wrap'>
              <div className='courseoutline-selection'>
              {currentItems.map((detail, index) => (
                <div className='courseoutline-box' key={index}>
                  <div className='course-content'>
                    <Checkbox 
                      checked={!!selectedCourses[detail.course_code]} 
                      onChange={(e) => handleAddCourseCode(e, detail.course_code)} 
                      sx={{
                        color: '#693E6A',
                        '&.Mui-checked': {
                          color: '#693E6A',
                        },
                      }}
                    />
                    <div className='course-details'>
                      <strong>{detail.course_code}</strong><br />
                      <strong>Course Name:</strong> {detail.course_name}<br />
                      <strong>Level:</strong> {detail.course_level}<br />
                      <strong>Semester:</strong> {detail.course_term}
                    </div>
                  </div>
                  <Tooltip title="Delete" placement='top'>
                    <IconButton 
                      aria-label='delete-course'
                      className='delete-button'
                      onClick={() => handleDeleteCourse(detail.course_code)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>            
                </div>
              ))}
              </div>
              <div className="pagination">
                <button className="pag-nav-button" onClick={prevPage} disabled={currentPage === 1}>
                  <ArrowBackIosNewIcon className='icon' fontSize="20px"/>
                </button>
                {pageNumbers.map(number => (
                  <button 
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`} 
                    key={number} 
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}
                <button className="pag-nav-button" onClick={nextPage} disabled={currentPage === pageNumbers.length}>
                  <ArrowForwardIosNewIcon className='icon' fontSize="20px"/>
                </button>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Items per page' }}
                  sx={{ marginLeft: 2 }}
                >
                  {[4, 6, 8, 10, 12, 14, 16].map(count => (
                    <MenuItem key={count} value={count}>
                      {count} items
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            </>
          )}
      </div>      
      <DeleteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={onConfirmAction}
        message={dialogMessage}
      />
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
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleErrorClose}
        message={errorMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{marginTop: '80px'}}
      >
        <Alert severity="error" onClose={handleErrorClose} variant="filled" >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CourseOutlines;
