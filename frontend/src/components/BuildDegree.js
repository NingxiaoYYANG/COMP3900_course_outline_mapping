import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BarChart from './BarChart';
import './styles/builddegree.css'
import TextButton from './TextButton';

function BuildDegree() {
  const location = useLocation();
  const { bloomsLabels } = location.state || {};

  console.log('Received Bloom\'s Counts:', bloomsLabels);

  return (
    <div>
      <div className='builddegree-container'>
        <div className="builddegreecontent">
          <div className='builddegree-title'>Build A Degree</div>
          <div className='builddegree-horizontalline'></div>
          <div className='builddegree-graph'>
            {bloomsLabels ? (
              <div>
                <BarChart data={bloomsLabels} />
              </div>
            ) : (
              <p>No Bloom's Taxonomy counts available.</p>
            )}
          </div>
        </div>
      </div>
      <Link to='/courseoutlines'>
         
        <TextButton text='BACK' />
      </Link>
    </div>
  )
}

export default BuildDegree;