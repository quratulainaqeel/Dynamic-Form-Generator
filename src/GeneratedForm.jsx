import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GeneratedForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check for valid state and navigate if not present
  useEffect(() => {
    if (!location.state || !location.state.formData) {
      navigate('/');
    }
  }, [location.state, navigate]); // Add dependencies

  // Extract form data from the location state
  const { formTitle, fields } = location.state.formData;
  const [formValues, setFormValues] = useState({});
  const [submissions, setSubmissions] = useState([]);

  // Retrieve saved submissions for this form from localStorage
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem(formTitle)) || [];
    setSubmissions(savedSubmissions);
  }, [formTitle]);

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedSubmissions = JSON.parse(localStorage.getItem(formTitle)) || [];
    const newSubmissions = [...savedSubmissions, formValues];
    localStorage.setItem(formTitle, JSON.stringify(newSubmissions));
    setSubmissions(newSubmissions);
    setFormValues({});
  };

  return (
    <div className="generated-form-container">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: '500px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="mb-4">{formTitle}</h2>
          {fields.map((field, index) => (
            <div key={index} className="form-field mb-3 w-100 d-flex justify-content-between" style={{ marginBottom: '15px' }}>
              <label className='me-3' style={{ fontWeight: 'bold', marginRight: '15px' }}>{field.name}</label>
              {field.type === 'String' && (
                <input
                  type="text"
                  className="form-control border border-secondary"
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.mandatory}
                  style={{ width: '70%' }}
                />
              )}
              {field.type === 'Number' && (
                <input
                  type="number"
                  className="form-control border border-secondary"
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.mandatory}
                  style={{ width: '70%' }}
                />
              )}
              {field.type === 'Dropdown' && (
                <select
                  className="form-control border border-secondary"
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.mandatory}
                  style={{ width: '70%' }}
                >
                  <option value="" disabled>Select</option>
                  {field.options.split(',').map((option, idx) => (
                    <option key={idx} value={option.trim()}>
                      {option.trim()}
                    </option>
                  ))}
                </select>
              )}
              {field.type === 'Date' && (
                <input
                  type="date"
                  className="form-control border border-secondary"
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.mandatory}
                  style={{ width: '70%' }}
                />
              )}
            </div>
          ))}
          <button type="submit" className='btn btn-outline-primary mt-3' style={{ width: '40%', fontSize: '16px', padding: '8px' }}>Save</button>
        </form>
      </div>

      {/* Display Last 10 Submissions */}
      <div className="mt-5 container">
        <h3>Last 10 Submissions</h3>
        {submissions.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {fields.map((field, index) => (
                  <th key={index} className='text-center'>{field.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.slice(-10).map((submission, idx) => (
                <tr key={idx}>
                  {fields.map((field, index) => (
                    <td key={index}>
                      {typeof submission[field.name] === 'boolean'
                        ? submission[field.name] ? 'True' : 'False'
                        : submission[field.name] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No submissions yet.</p>
        )}
      </div>
    </div>
  );
}

export default GeneratedForm;
