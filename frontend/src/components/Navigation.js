import { Link, useLocation } from 'react-router-dom';
import './styles/navigation.css'
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';

function Navigation() {
  const location = useLocation().pathname;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='navigation-container'>
      <div className='navigation-text-container'>
        <div className='navigation-title'>CourseMapper</div>
        <div className='vertical-line'></div>
        <div className='burger-navigation'>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon sx={{color: 'white'}}/>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}><Link to='/' className='nav-list-item'  style={location === '/' ? {borderBottom: '2px solid #070F2B'} : {}}>HOME</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to='/courseoutlines' className='nav-list-item' style={location === '/courseoutlines' ? {borderBottom: '2px solid #070F2B'} : {}}>COURSE OUTLINES</Link></MenuItem>
          </Menu>
        </div>
        <div className='navigation-list-items'>
          <div className='nav-list-item-container'><Link to='/' className='nav-list-item'  style={location === '/' ? {borderBottom: '2px solid #FCD3CA'} : {}}>HOME</Link></div>
          <div className='nav-list-item-container'><Link to='/courseoutlines' className='nav-list-item' style={location === '/courseoutlines' ? {borderBottom: '2px solid #FCD3CA'} : {}}>COURSE OUTLINES</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Navigation;