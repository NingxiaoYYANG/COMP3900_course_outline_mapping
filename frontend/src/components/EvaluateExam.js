import { useLocation, useNavigate } from "react-router-dom";
import './styles/exam.css';
import BarChart from "./BarChart";
import TextButton from "./TextButton";


function EvaluateExam() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bloomsCount, examContents } = location.state || {};
  const questions = examContents.trim().split('\n');

  const bloomsColors = {
    "Remember": "#58745A",
    "Understand": "#734474", 
    "Apply": "#D33A22", 
    "Analyse": "#3D54B8", 
    "Evaluate": "#FFA10A", 
    "Create": "#2FC6B0"
  };

  const getColor = (word) => {
    const bloomLevel = bloomsCount[word.toLowerCase()];
    return bloomsColors[bloomLevel] || 'black';
  };

  const ColoredText = ({ text }) => {
    const coloredText = text.split(' ').map((word, index) => {
      const color = getColor(word.replace(/[.,?!]/g, ''));
      return (
        <span 
          key={index} 
          style={{ 
            color: color, 
            fontWeight: color !== 'black' ? '700' : 'normal' 
          }}
        >
          {word}{' '}
        </span>
      );
    });
  
    return <div>{coloredText}</div>;
  };

  const count = {
    "Remember": 0,
    "Understand": 0,
    "Apply": 0,
    "Analyse": 0,
    "Evaluate": 0,
    "Create": 0
  };

  Object.values(bloomsCount).forEach(level => {
    if (count.hasOwnProperty(level)) {
      count[level]++;
    }
  });

  const handleClick = () => {
    navigate('/');  
  };
  
  return (
    <div className="exam-wrapper">
      <div className="exam-container">
        <div className="exam-title">Evaluate Exam Paper</div>
        <div className='exam-horizontalline'></div>
        <div className='exam-content'>
          <div className='exam-questions'>
            <h4>Exam Questions</h4>
            {questions.map((question, index) => (
              <div key={index} style={{ marginBottom: '8px'}}>
                <ColoredText text={question} />
              </div>
            ))}
          </div>
          <div className='exam-graph'>
              {count ? (
                <BarChart data={bloomsCount} />
              ) : (
                <p>No Bloom's Taxonomy counts available.</p>
              )}
          </div>
          <div className='exam-button-container'>
            <TextButton text='BACK' handleclick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  )
}


export default EvaluateExam;
