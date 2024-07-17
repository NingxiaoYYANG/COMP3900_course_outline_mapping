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


function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [classifyResults, setClassifyResults] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // const courseDetails = [
  //   ['COMP3121', 'Title', 'UG', '2'],
  //   ['COMP4121', 'Title', 'UG', '2'],
  //   ['COMP2121', 'Title', 'UG', '2'],
  //   ['COMP5121', 'Title', 'UG', '2'],
  //   ['COMP4121', 'Title', 'UG', '2'],
  //   ['COMP2121', 'Title', 'UG', '2'],
  //   ['COMP5121', 'Title', 'UG', '2'],
  //   ['COMP4121', 'mary', 'UG', '2'],
  //   ['COMP2121', 'moo', 'UG', '2'],
  //   ['COMP5121', 'maar', 'UG', '2'],
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

  const filteredCourseDetails = courseDetails.filter(
    (detail) => detail.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detail.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isBoxVisible, setItBoxVisible] = useState(false);

  const handleFilterClick = () => {
    setItBoxVisible(!isBoxVisible);
  }

  const [year, setYear] = useState('');
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div>
      <div className='courseoutline-container'>
        <div className="coursecontent">
          <div className='course-title-content'>
            <div className='course-title'>Course Outlines</div>
            {/* <div>search</div> */}
            <div style={{ alignItems: 'center', display: 'flex', position: 'relative' }}>
            
              <IconButton aria-label='filter' onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
              {isBoxVisible && <div className='box'>
                <div style={{ width: '90%', margin: '0 auto'}}>
                  <h5>Filter</h5>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={year}
                      label="Year"
                      onChange={handleYearChange}
                    >
                      <MenuItem value='hoo'>hoo</MenuItem>
                      <MenuItem value='hoo'>hoo</MenuItem>
                      <MenuItem value='hoo'>hoo</MenuItem>
                    </Select>
                  </FormControl>
                  
                </div>
                FilterList
                Year
                Term
                Teaching Period
                Delivery Mode
                Delivery format
                location
                Faculty
                </div>}
            
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
              />
            </div>
             {/* <input 
              type="text" 
              placeholder="Search by code or name" 
              value={searchQuery} 
              onChange={handleSearchQueryChange}
              style={{
                padding: '8px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            /> */}
           </div>
           <div style={{fontSize: '10pt', color: courseCodes.length === 0 ? '#fff' : '#AB1748'}}>selected {courseCodes.length} outlines...</div>
           {error && <p style={{ color: 'red' }}>{error}</p>}
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
           <div>
         </div>
         </div>
       </div>
       <div className='next-button'>
       
        <button onClick={handleClick} style={{
            backgroundColor: '#AB1748', 
            border: 'none', 
            color: 'white',
            padding: '12px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '14pt',
          }}
            className='button'
          >
            NEXT   <ArrowForwardIosNewIcon />
         </button>
       </div>
      
    </div>
  );
}

export default CourseOutlines;
