import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './components/Home';
import CourseOutlines from './components/CourseOutlines';
import BuildDegree from './components/BuildDegree';
import Navigation from './components/Navigation';
import bottomImage from './components/images/repeat.png'
import EvaluateExam from './components/EvaluateExam';

function Routing() {
  return (
    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route path='/courseoutlines' element={<CourseOutlines/>}/>
      <Route path='/courseoutlines/builddegree' element={<BuildDegree/>} />
      <Route path='/buildexam' element={<EvaluateExam/>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className='app-container'>
        <div className='app-nav' style={{zIndex: '1'}}>
          <Navigation />
        </div>
        <div className='app-content'>
          <Routing />
        </div>
        <div className="bottom-center-container">
          <div className="bottom-center-image-container">
            <img src={bottomImage} alt="figure on a chair sketch" className="bottom-center-image" />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
