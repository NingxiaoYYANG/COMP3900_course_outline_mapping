import { Link } from 'react-router-dom';
import './styles/navigation.css'
function Navigation() {

  return (
    <div className='navigation-container'>
      <div className='navigation-text-container'>
        <div className='navigation-title'>CourseMapper</div>
        <div className='vertical-line'></div>
        <div className='navigation-list-items'>
          <div className='nav-list-item-container'><Link to='/' className='nav-list-item'>HOME</Link></div>
          <div className='nav-list-item-container'><Link to='/courseoutlines' className='nav-list-item'>COURSE OUTLINES</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Navigation;