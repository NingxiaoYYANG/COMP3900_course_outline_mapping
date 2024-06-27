import { Link, useLocation } from 'react-router-dom';
import './styles/navigation.css'
import React from 'react';
function Navigation() {
  const location = useLocation().pathname;

  return (
    <div className='navigation-container'>
      <div className='navigation-text-container'>
        <div className='navigation-title'>CourseMapper</div>
        <div className='vertical-line'></div>
        <div className='navigation-list-items'>

          <div className='nav-list-item-container'><Link to='/' className='nav-list-item'  style={location === '/' ? {borderBottom: '2px solid #FCD3CA'} : {}}>HOME</Link></div>
          <div className='nav-list-item-container'><Link to='/courseoutlines' className='nav-list-item' style={location === '/courseoutlines' ? {borderBottom: '2px solid #FCD3CA'} : {}}>COURSE OUTLINES</Link></div>
          <div className='nav-list-item-container'><Link to='/courseoutlines/uploadfile' className='nav-list-item' style={location === '/courseoutlines/uploadfile' ? {borderBottom: '2px solid #FCD3CA'} : {}}>UPLOAD PDF</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Navigation;