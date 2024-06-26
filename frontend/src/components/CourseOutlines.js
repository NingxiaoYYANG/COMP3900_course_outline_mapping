import React, { useState } from 'react';
import axios from 'axios';

function CourseOutlines() {
  const [courseCode, setCourseCode] = useState('');
  const [bloomsLabels, setBloomsLabels] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCourseCode(e.target.value);
  };

  const handleFetchBloomsCount = async () => {
    if (!courseCode) {
      setError('Please enter a course code.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('course_code', [courseCode]);

      const response = await axios.post('http://localhost:5000/api/classify_clos', formData);
      setBloomsLabels(response.data.blooms_count);
      setError('');
    } catch (err) {
      setError('Error fetching Bloom\'s taxonomy counts. Please try again.');
      setBloomsLabels(null);
    }
  };

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
      <button onClick={handleFetchBloomsCount}>Fetch Bloom's Counts</button>
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