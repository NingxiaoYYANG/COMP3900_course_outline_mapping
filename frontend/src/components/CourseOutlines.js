import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import './styles/courseoutlines.css'
import TextButton from './TextButton';


function CourseOutlines() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [bloomsLabels, setBloomsLabels] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleFetchBloomsCount = async () => {
    if (courseCodes.length === 0) {
      setError('Please add at least one course code.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('course_codes', JSON.stringify(courseCodes));

      const response = await axios.post('http://localhost:5000/api/classify_clos', formData);
      setBloomsLabels(response.data.blooms_count);
      setError('');
    } catch (err) {
      setError('Error fetching Bloom\'s taxonomy counts. Please try again.');
      setBloomsLabels(null);
    }
  };

  const handleClick = async () => {
    const bloomsCounts = await handleFetchBloomsCount();
    console.log('Bloom\'s Counts before navigating:', bloomsLabels);
    if (bloomsLabels) {
      console.log('here')
      navigate('/courseoutlines/builddegree', { state: { bloomsLabels } });  // Pass data to the next page
    }
  };

  return (
    <div>
      <div className='courseoutline-container'>
         <div className="coursecontent">
           <div className='course-title-content'>
             <div className='course-title'>Course Outlines</div>
             <div>search</div>
           </div>
           <div className='course-horizontalline'></div>
           <div className='courseoutline-selection'>
             <div className='courseoutline-box left'>
               <div><Checkbox onChange={(e) => handleAddCourseCode(e, 'COMP1531')} /></div>
               <div>
                 <h6>COMP1531</h6>
               </div>
             </div>
             <div className='courseoutline-box right'>
               <div><Checkbox onChange={(e) => handleAddCourseCode(e, 'COMP3900')} /></div>
               <div>
                 <h6>COMP3900</h6>
               </div>
             </div>
           </div>
           <div>
           {courseCodes.length > 0 && (
             <div>
               <h3>Selected Course Codes:</h3>
               <ul>
                 {courseCodes.map((code, index) => (
                   <li key={index}>{code}</li>
                 ))}
               </ul>
             </div>
           )}
           
            {error && <p style={{ color: 'red' }}>{error}</p>}
         </div>
         </div>
       </div>
       <div className='next-button'>
       <button onClick={handleClick}>generate</button>
         <Link to='/courseoutlines/builddegree'>
         
           <TextButton text='NEXT' />
         </Link>
         
       </div>
      
    </div>
  );
}

export default CourseOutlines;
