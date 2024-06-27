import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseOutlines() {
  const [courseCode, setCourseCode] = useState('');
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [bloomsLabels, setBloomsLabels] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCourseCode(e.target.value);
  };

  const handleAddCourseCode = () => {
    const codePattern = /^[A-Za-z]{4}\d{4}$/;
    if (!codePattern.test(courseCode)) {
      setError('Please enter course code in correct format (e.g., ABCD1234).');
      return;
    }
    setCourseCodes([...courseCodes, courseCode]);
    setCourseCode('');  // Clear the input field
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

      const response = await axios.post('http://localhost:5000/api/classify_clos', formData);
      setBloomsLabels(response.data.blooms_count);
      setError('');
    } catch (err) {
      setError('Error fetching Bloom\'s taxonomy counts. Please try again.');
      setBloomsLabels(null);
    }
  };

  useEffect(() => {
    // This code runs once when the component mounts
    fetchCourseDetails();
  }, []); 

  return (
    <div>
      <h2>Retrieve Bloom's Taxonomy Counts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Course Code:
        <input
          type="text"
          value={courseCode}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleAddCourseCode}>Add Course Code</button>
      <button onClick={handleFetchBloomsCount}>Fetch Bloom's Counts</button>

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

      {courseDetails.length > 0 && (
        <div>
        <h3>Selected Course Codes:</h3>
        <ul>
          {courseDetails.map((detail, index) => (
            <li key={index}>
              <strong>Course Code:</strong> {detail[0]}<br />
              <strong>Course Name:</strong> {detail[1]}<br />
              <strong>Level:</strong> {detail[2]}<br />
              <strong>Semester:</strong> {detail[3]}
            </li>
          ))}
        </ul>
      </div>
      )}

      {bloomsLabels && (
        <div>
          <h3>Bloom's Taxonomy Counts</h3>
          <pre>{JSON.stringify(bloomsLabels, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CourseOutlines;
