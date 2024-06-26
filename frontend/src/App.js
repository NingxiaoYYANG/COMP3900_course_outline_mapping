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
import UploadCourse from './components/UploadCourse';

function Routing() {
  return (
    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route path='/courseoutlines' element={<CourseOutlines/>}/>
      <Route path='/courseoutlines/builddegree' element={<BuildDegree/>} />
      <Route path='/courseoutlines/uploadfile' element={<UploadCourse/>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <div style={{ minWidth: '100vw', minHeight: '100vh',backgroundColor: '#FCD3CA'}}>
        <div style={{ paddingTop: '100px' }}>
          <Routing />
        </div>
      </div>
  
    </Router>
  );
}

export default App;
