import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import Home from './components/Home';
import CourseOutlines from './components/CourseOutlines';
import BuildDegree from './components/BuildDegree';
import Navigation from './components/Navigation';

function Routing() {
  return (
    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route path='/courseoutlines' element={<CourseOutlines/>}/>
      <Route path='/courseoutlines/builddegree' element={<BuildDegree/>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Navigation />
        <div className='app-content'>
          {/* <div style={{ paddingTop: '100px' }}> */}
            <Routing />
          {/* </div> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
