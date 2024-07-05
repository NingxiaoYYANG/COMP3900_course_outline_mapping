import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import './styles/courseoutlines.css'
import TextButton from './TextButton';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  // const [courseDetails, setCourseDetails] = useState([]);
  const [bloomsLabels, setBloomsLabels] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const courseDetails = [
    ['COMP3121', 'Title', 'UG', '2'],
    ['COMP4121', 'Title', 'UG', '2'],
    ['COMP2121', 'Title', 'UG', '2'],
    ['COMP5121', 'Title', 'UG', '2'],
    ['COMP4121', 'Title', 'UG', '2'],
    ['COMP2121', 'Title', 'UG', '2'],
    ['COMP5121', 'Title', 'UG', '2'],
    ['COMP4121', 'mary', 'UG', '2'],
    ['COMP2121', 'moo', 'UG', '2'],
    ['COMP5121', 'maar', 'UG', '2'],
  ]

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

  // const fetchCourseDetails = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/courses');
  //     console.log(response)
  //     setCourseDetails(response.data.course_details);
  //   } catch (err) {
  //     setError('Error fetching course details. Please try again.');
  //     setBloomsLabels(null);
  //   }
  // }

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
    // fetchCourseDetails();
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

  const filteredCourseDetails = courseDetails.filter(
    (detail) => detail[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
    detail[1].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className='courseoutline-container'>
        <div className="coursecontent">
          <div className='course-title-content'>
            <div className='course-title'>Course Outlines</div>
             {/* <div>search</div> */}
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
