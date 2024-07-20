import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import './styles/courseoutlines.css'
import TextButton from './TextButton';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SelectField from './SelectField';


function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [classifyResults, setClassifyResults] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  const handleAddCourseCode = (e, code) => {
    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    const checked = e.target.checked;
    if (!codePattern.test(code)) {
      console.log(code)
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      return;
    }
    if (checked &&!courseCodes.includes(code)) {
      setCourseCodes([...courseCodes, code])
    } else if (!checked &&courseCodes.includes(code)) {
      setCourseCodes(courseCodes.filter(c => c !== code));
    }
    setError('');
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/courses');
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

      const response = await axios.post('http://127.0.0.1:5000/api/classify_clos', formData);
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

  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleFilterClick = () => {
    setIsBoxVisible(!isBoxVisible);
  }
  
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
    const matchesStudyLevel = selectedStudyLevel === '' || detail.faculty === selectedStudyLevel;
    const matchesCampus = selectedCampus === '' || detail.campus === selectedCampus;

    return matchesSearchQuery && matchesTerm && matchesDeliveryMode && matchesDeliveryFormat && matchesLocation && matchesFaculty && matchesStudyLevel && matchesCampus;
  });

  return (
    <div className='courseoutline-wrapper'>
      <div className='courseoutline-container'>
          <div className='course-title-content'>
            <div className='course-title'>Course Outlines</div>
            <div className='filter-button-container'>
              <IconButton aria-label='filter' onClick={handleFilterClick} style={{ marginRight: '20px' }}>
                <FilterListIcon />
              </IconButton>
              
              {isBoxVisible && <div className='box'>
                <div style={{ width: '90%', margin: '0 auto'}}>
                <h5 className="search-bar-filter">Search</h5>
                <div className="search-bar-filter">
                  <TextField 
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
                    style={{ marginRight: '20px' }}
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
              </div>}
            
              <div className="search-bar" style={{justifySelf: 'flex-end'}}>
                <TextField 
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
                />
              </div>
              <TextButton text='NEXT' handleclick={handleClick}/>
            </div>
          </div>
          <div style={{fontSize: '10pt', color: error ? '#AB1748' : courseCodes.length === 0 ? '#fff' : '#AB1748'}}>
            {error || `Selected ${courseCodes.length} outlines...`}
          </div>
          <div className='course-horizontalline'></div>
          <div className='courseoutline-selection'>
            {filteredCourseDetails.map((detail, index) => (
              <div className={`courseoutline-box`} key={index}>
                <div><Checkbox onChange={(e) => handleAddCourseCode(e, detail.course_code)} /></div>
                <div>
                  <strong>{detail.course_code}</strong><br />
                  <strong>Course Name:</strong> {detail.course_name}<br />
                  <strong>Level:</strong> {detail.course_level}<br />
                  <strong>Semester:</strong> {detail.course_term}
                </div>
              </div>
            ))}
          </div>
      </div>      
    </div>
  );
}

export default CourseOutlines;
