// BuildDegree.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BarChart from './BarChart';
import './styles/builddegree.css';
import TextButton from './TextButton';

function BuildDegree() {
  const location = useLocation();
  const { bloomsLabels } = location.state || {};

  console.log('Received Bloom\'s Counts:', bloomsLabels);

  return (
    <div className='builddegree-container'>
      <div className="builddegreecontent">
        <div className='builddegree-title'>Build A Degree</div>
        <div className='builddegree-horizontalline'></div>
        <div className='builddegree-graph'>
          {bloomsLabels ? (
            <BarChart data={bloomsLabels} />
          ) : (
            <p>No Bloom's Taxonomy counts available.</p>
          )}
        </div>
      </div>
      <Link to='/courseoutlines' className='builddegree-button'>
        <TextButton text='BACK' />
      </Link>
    </div>
  );
}

export default BuildDegree;
