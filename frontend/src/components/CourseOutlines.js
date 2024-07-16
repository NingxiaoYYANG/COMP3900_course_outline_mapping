import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import './styles/courseoutlines.css'
import TextButton from './TextButton';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SelectField from './SelectField';


function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [bloomsLabels, setBloomsLabels] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // const courseDetails = [
  //   ['COMP3121', 'Title', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP4121', 'moo', 'PG', '2', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP2121', 'hoo', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP3121', 'Title', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP4121', 'moo', 'PG', '2', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP2121', 'hoo', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP3121', 'Title', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP4121', 'moo', 'PG', '2', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  //   ['COMP2121', 'hoo', 'UG', '1', 'faculty', 'delivery mode', 'delivery format', 'delivery location', 'campus'
  //   ],
  // ]

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
    // setCourseCode('');  // Clear the input field
    setError('');
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      console.log(response)
      setCourseDetails(response.data.course_details);
    } catch (err) {
      setError('Error fetching course details. Please try again.');
      setBloomsLabels(null);
    }
  }

  const handleFetchBloomsCount = async () => {
    if (courseCodes.length === 0) {
      setError('Please add at least one course code.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('course_codes', JSON.stringify(courseCodes));
      formData.append('course_codes', JSON.stringify(courseCodes));

      const response = await axios.post('http://localhost:5000/api/classify_clos', formData);
      setBloomsLabels(response.data.blooms_count);
      setError('');
      return response.data.blooms_count;
    } catch (err) {
      setError('Error fetching Bloom\'s taxonomy counts. Please try again.');
      setBloomsLabels(null);
      return null
    }
  };

  React.useEffect(() => {
    fetchCourseDetails();
  }, []); 

  const handleClick = async () => {
    const bloomsCounts = await handleFetchBloomsCount();
    console.log('Bloom\'s Counts before navigating:', bloomsCounts);
    if (bloomsCounts) {
      console.log('here')
      navigate('/courseoutlines/builddegree', { state: { bloomsLabels: bloomsCounts } });  // Pass data to the next page
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

  // const uniqueYears = Array.from(new Set(courseDetails.map(course => course[4]))).sort((a, b) => b - a);
  const uniqueTerms = [...new Set(courseDetails.map(course => course[3]))].sort();
  const uniqueDeliveryMode = [...new Set(courseDetails.map(course => course[5]))].sort();
  const uniqueDeliveryFormat = [...new Set(courseDetails.map(course => course[6]))].sort();
  const uniqueLocation = [...new Set(courseDetails.map(course => course[7]))].sort();
  const uniqueFaculty = [...new Set(courseDetails.map(course => course[4]))].sort();
  const uniqueStudyLevel = [...new Set(courseDetails.map(course => course[2]))].sort();
  const uniqueCampus = [...new Set(courseDetails.map(course => course[8]))].sort();


  const filteredCourseDetails = courseDetails.filter((detail) => {
    const matchesSearchQuery = detail[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
                               detail[1].toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesYear = selectedYear === '' || detail[4] === selectedYear;
    const matchesTerm = selectedTerm === '' || detail[3] === selectedTerm;
    const matchesDeliveryMode = selectedDeliveryMode === '' || detail[5] === selectedDeliveryMode;
    const matchesDeliveryFormat = selectedDeliveryFormat === '' || detail[6] === selectedDeliveryFormat;
    const matchesLocation = selectedLocation === '' || detail[7] === selectedLocation;
    const matchesFaculty = selectedFaculty === '' || detail[7] === selectedFaculty;
    const matchesStudyLevel = selectedStudyLevel === '' || detail[2] === selectedStudyLevel;
    const matchesCampus = selectedCampus === '' || detail[8] === selectedCampus;

    return matchesSearchQuery && matchesTerm && matchesDeliveryMode && matchesDeliveryFormat && matchesLocation && matchesFaculty && matchesStudyLevel && matchesCampus;
  });

  return (
    <div>
      <div className='courseoutline-container'>
        <div className="coursecontent">
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
                  {/* <SelectField 
                    label="Year"
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    options={uniqueYears}
                  /> */}
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
                <div><Checkbox onChange={(e) => handleAddCourseCode(e, detail[0])} /></div>
                <div>
                  <strong>{detail[0]}</strong><br />
                  <strong>Course Name:</strong> {detail[1]}<br />
                  <strong>Level:</strong> {detail[2]}<br />
                  <strong>Semester:</strong> {detail[3]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>      
    </div>
  );
}

export default CourseOutlines;
