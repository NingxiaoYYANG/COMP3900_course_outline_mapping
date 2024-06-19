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
      <Route path='/coureoutlines' element={<CourseOutlines/>}/>
      <Route path='/coureoutlines/builddegree' element={<BuildDegree/>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routing />
  
    </Router>
  );
}

export default App;
