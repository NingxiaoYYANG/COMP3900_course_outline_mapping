import { useLocation } from "react-router-dom";
import './styles/exam.css';
import BarChart from "./BarChart";
function EvaluateExam() {
  const location = useLocation();
  // const { bloomsCount } = location.state || {};

  const bloomsCount =  
  {
    "contrast": "Evaluate",
    "describe": "Remember",
    "explain": "Create",
    "identify": "Analyse",
    "includes": "Understand",
    "ordering": "Analyse",
    "sorts": "Understand",
    "summarize": "Understand",
    "using": "Apply"
  }

  console.log('Received Bloom\'s Counts:', bloomsCount);

  const bloomsColors = {
    "Remember": "#800000", // Maroon
    "Understand": "#000080", // Navy
    "Apply": "#013220", // Dark Green
    "Analyse": "#8B4513", // SaddleBrown
    "Evaluate": "#FF4500", // OrangeRed
    "Create": "#4B0082" // Indigo
  };

  const questions = [
    "1. Explain the BFS algorithm and identify 1 usecase.",
    "2. Explain how a binary search algorithm works and describe a scenario where it would be more efficient than a linear search.",
    "3. Implement a function in C that sorts a list of integers using the quicksort algorithm.",
    "4. Compare and contrast the time complexity of bubble sort and merge sort. Under what conditions would one be preferable over the other?",
    "5. Design a database schema for a library management system that includes tables for books, authors, members, and borrow transactions.",
    "6. Summarize the differences between TCP and UDP protocols in terms of reliability, ordering, and connection state."
  ];

  const getColor = (word) => {
    const bloomLevel = bloomsCount[word.toLowerCase()];
    return bloomsColors[bloomLevel] || 'black'; // Default color if not found
  };

  const ColoredText = ({ text }) => {
    // Split the text into words and color each word based on Bloom's taxonomy
    const coloredText = text.split(' ').map((word, index) => {
      const color = getColor(word.replace(/[.,?!]/g, '')); // Remove punctuation
      return (
        <span key={index} style={{ color: color, fontWeight: color !== 'black' ? '700' : 'normal' }}>
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
  
  return (<>
  <div className="exam-wrapper">
    <div className="exam-container">
      <div className="exam-title">Evaluate Exam Paper</div>
      <div className='exam-horizontalline'></div>
      <div className='exam-content'>
        {questions.map((question, index) => (
          <div key={index}>
            <ColoredText text={question} />
            <br />
          </div>
        ))}
        <div className='builddegree-graph'>
            {count ? (
              <BarChart data={count} />
            ) : (
              <p>No Bloom's Taxonomy counts available.</p>
            )}
          </div>
      </div>
    </div>
  </div>
  
  

</>)
}

// 1. Explain the BFS algorithm and identify 1 usecase.
// 2. Explain how a binary search algorithm works and describe a scenario where it would be more efficient than a linear search.
// 3. Implement a function in C that sorts a list of integers using the quicksort algorithm.
// 4. Compare and contrast the time complexity of bubble sort and merge sort. Under what conditions would one be preferable over the other?
// 5. Design a database schema for a library management system that includes tables for books, authors, members, and borrow transactions.
// 6. Summarize the differences between TCP and UDP protocols in terms of reliability, ordering, and connection state.

export default EvaluateExam;