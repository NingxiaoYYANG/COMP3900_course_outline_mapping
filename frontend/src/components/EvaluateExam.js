import { useLocation } from "react-router-dom";
import './styles/exam.css';
import BarChart from "./BarChart";
function EvaluateExam() {
  const location = useLocation();
  const { bloomsCount } = location.state || {};

  console.log('Received Bloom\'s Counts:', bloomsCount);
  
  return (<>
  <div className="exam-wrapper">
    <div className="exam-container">
      <div className="exam-title">Evaluate Exam Paper</div>
      <div className='exam-horizontalline'></div>
      <div className='exam-content'>
1. Draw a diagram explaining how air pressure affects the weather.
2. Determine the next number in a sequence.
3. Show how E-CRM can be used to improve marketing positioning as explained in the article.
4. Write a C++ statement to declare a variable of type music Type name MyTune.
        <div className='exam-graph'>
          {/* {bloomsCount.blooms_count ? (
            <BarChart data={bloomsCount.blooms_count} />
          ) : (
            <p>No Bloom's Taxonomy counts available.</p>
          )} */}
        </div>
      </div>
    </div>
  </div>
  
  

</>)
}

export default EvaluateExam;