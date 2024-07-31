import './styles/uploadcourse.css'
export default function CoursePreview({ course_details }) {
  const { 
    course_code, 
    course_name, 
    course_level, 
    course_term,
    campus,
    delivery_format,
    delivery_location,
    delivery_mode,
    faculty,
    course_clos,
  } = course_details;
  console.log(course_code)
  return(<>
    <div style={{ padding: '20px'}}>
      <h2 style={{margin: '0', padding: '0 0 10px 0'}}>Course Outline Preview</h2>
      <div style={{margin: '0', padding: '0 0 15px 0'}}>
        <h5 style={{margin: '0', padding: '0'}}>{course_code}</h5>
        <h4 style={{margin: '0', padding: '0'}}>{course_name}</h4>
      </div>
      <div className="preview-item">
        <strong>Course Level:</strong> {course_level}
      </div>
      <div className="preview-item">
        <strong>Course Term:</strong> {course_term}
      </div>
      <div className="preview-item">
        <strong>Campus:</strong> {campus}
      </div>
      <div className="preview-item">
        <strong>Delivery Format:</strong> {delivery_format}
      </div>
      <div className="preview-item">
        <strong>Delivery Location:</strong> {delivery_location}
      </div>
      <div className="preview-item">
        <strong>Delivery Mode:</strong> {delivery_mode}
      </div>
      <div className="preview-item">
        <strong>Faculty:</strong> {faculty}
      </div>
      <div className="preview-item">
        <strong>Course CLOs:</strong>
        <div style={{marginTop: '-10px', padding: '0'}}>
          <ul>
            {course_clos && course_clos.map((clo, index) => (
              <li key={index}>{clo}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>)
}