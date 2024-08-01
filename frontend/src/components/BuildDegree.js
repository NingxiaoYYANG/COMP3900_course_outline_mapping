import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import BarChart from './BarChart';
import './styles/builddegree.css';
import TextButton from './TextButton';

function BuildDegree() {
  const location = useLocation();
  const { classifyResults } = location.state || {};
  const navigate = useNavigate();

  const bloomsColors = {
    "Remember": "#58745A",
    "Understand": "#734474", 
    "Apply": "#D33A22", 
    "Analyse": "#3D54B8", 
    "Evaluate": "#FFA10A", 
    "Create": "#2FC6B0"
  };

  const handleClick = () => {
    navigate('/courseoutlines');  
  };

  // Function to highlight words in CLOs with tooltips
  const highlightWords = (clo, wordToBlooms) => {
    // Regular expression to split by any non-word character while retaining punctuation
    const words = clo.split(/(\W+)/).filter(Boolean);
    
    return words.map((word, index) => {
      const bloomLevel = wordToBlooms[word.toLowerCase()];
      const tooltipId = `tooltip-${index}-${word}`;
      
      // Check if the word is only punctuation
      const isPunctuation = word.match(/^\W+$/);
  
      return (
        <span
          key={index}
          style={{ color: bloomLevel ? bloomsColors[bloomLevel] : 'black', fontWeight: bloomLevel ? 'bold' : 'normal' }}
          data-tooltip-id={bloomLevel && !isPunctuation ? tooltipId : null}
        >
          {word}{' '}
          {bloomLevel && !isPunctuation && (
            <Tooltip id={tooltipId} place="top" effect="solid">
              {bloomLevel}
            </Tooltip>
          )}
        </span>
      );
    });
  };
  

  return (
    <div className='builddegree-container'>
      <div className="builddegree-content">
        <div className='builddegree-title'>Build A Degree</div>
        <div className='builddegree-horizontalline'></div>
        <div className='builddegree-maintext'>
          <div className='builddegree-clo'>
            <h3>Course CLOs:</h3>
            {Object.entries(classifyResults.courses_info).map(([course_code, info]) => (
              <div key={course_code}>
                <h4>{course_code}</h4>
                <ul>
                  {info.clos.map((clo, index) => (
                    <li key={index}>
                      {console.log(info.word_to_blooms)}
                      {highlightWords(clo, info.word_to_blooms)}
                    </li>
                  ))}
                </ul>
                <div className='builddegree-labels'>
                  {Object.entries(bloomsColors).map(([level, color]) => (
                    <span key={level} style={{ color: color, fontWeight: 'bold', marginRight: '10px' }}>
                      {level} : {info.blooms_count[level]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className='builddegree-graph'>
            {classifyResults.blooms_count ? (
              <BarChart data={classifyResults.blooms_count} />
            ) : (
              <p>No Bloom's Taxonomy counts available.</p>
            )}
          </div>
        </div>
        <div className='builddegree-button-container'>
          <TextButton text='BACK' handleclick={handleClick} />
        </div>
      </div>
    </div>
  );
}

export default BuildDegree;
