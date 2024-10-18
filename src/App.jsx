import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [fileFormat, setFileFormat] = useState('JSON'); // New state for file format
  const navigate = useNavigate();

  const handleAddRow = () => {
    setFields([...fields, { name: '', type: 'String', mandatory: false, options: '' }]);
  };

  const handleGenerateForm = () => {
    if (!formTitle.trim()) {
      alert('Please enter a Form Title before generating the form.');
      return;
    }

    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    const existingForm = savedForms.find((form) => form.formTitle === formTitle);

    if (existingForm) {
      alert(`Form with the title "${formTitle}" already exists! Please choose a different title.`);
      return;
    }

    const formData = { formTitle, fields };
    savedForms.push(formData);
    localStorage.setItem('savedForms', JSON.stringify(savedForms));

    navigate('/generated-form', { state: { formData } });
  };

  const handleSaveFile = () => {
    const formData = { formTitle, fields };
    let fileContent;
    let fileExtension;

    if (fileFormat === 'JSON') {
      fileContent = JSON.stringify(formData);
      fileExtension = 'json';
    } else if (fileFormat === 'XML') {
      fileContent = `
        <form>
          <formTitle>${formTitle}</formTitle>
          <fields>
            ${fields.map(field => `
              <field>
                <name>${field.name}</name>
                <type>${field.type}</type>
                <mandatory>${field.mandatory}</mandatory>
                <options>${field.options}</options>
              </field>
            `).join('')}
          </fields>
        </form>
      `;
      fileExtension = 'xml';
    }

    const blob = new Blob([fileContent], { type: fileFormat === 'JSON' ? 'application/json' : 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formData.${fileExtension}`;
    a.click();
  };

  const handleLoadFile = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (fileFormat === 'JSON') {
        const jsonData = JSON.parse(e.target.result);
        setFormTitle(jsonData.formTitle);
        setFields(jsonData.fields);
      } else if (fileFormat === 'XML') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
        const title = xmlDoc.getElementsByTagName("formTitle")[0].textContent;
        const fields = Array.from(xmlDoc.getElementsByTagName("field")).map(field => ({
          name: field.getElementsByTagName("name")[0].textContent,
          type: field.getElementsByTagName("type")[0].textContent,
          mandatory: field.getElementsByTagName("mandatory")[0].textContent === 'true',
          options: field.getElementsByTagName("options")[0].textContent,
        }));

        setFormTitle(title);
        setFields(fields);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = fields.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    setFields(updatedFields);
  };

  const handleDeleteRow = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem('savedForms')) || [];
    setSavedForms(forms);
  }, []);

  const handleFormSelect = (e) => {
    setSelectedForm(e.target.value);
  };

  const handleExistingFormLoad = () => {
    const formData = savedForms.find((form) => form.formTitle === selectedForm);

    if (formData) {
      navigate('/generated-form', { state: { formData } });
    }
  };

  return (
    <>
      <div className="form-container">
        <h1>Create a form with Fields</h1>
        <div className="button-row">
          <button onClick={handleAddRow}>Add row</button>
          <button onClick={handleSaveFile}>Save as {fileFormat}</button>
          <button>
            <label htmlFor="fileInput" className="jsonFileLabel">
              Load {fileFormat}
            </label>
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept={fileFormat === 'JSON' ? '.json' : '.xml'}
            onChange={handleLoadFile}
          />
          <button onClick={handleGenerateForm}>Save Form</button>
        </div>
        <div className="form-title">
          <label>Form Title</label>
          <input
            type="text"
            placeholder="Enter form title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>

        {/* New Section for File Format Selection */}
        <div className="file-format-selection">
          <label  className='mx-2'>
            <input
              type="radio"
              value="JSON"
              checked={fileFormat === 'JSON'}
              onChange={(e) => setFileFormat(e.target.value)}
            />
            JSON
          </label>
          <label className='mx-2'>
            <input
              type="radio"
              value="XML"
              checked={fileFormat === 'XML'}
              onChange={(e) => setFileFormat(e.target.value)}
            />
            XML
          </label>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Mandatory</th>
              <th>Options</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="Field Name"
                  />
                </td>
                <td>
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                  >
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Date">Date</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={field.mandatory}
                    onChange={(e) => handleFieldChange(index, 'mandatory', e.target.checked)}
                  />
                </td>
                <td>
                  {field.type === 'Dropdown' && (
                    <input
                      type="text"
                      value={field.options}
                      onChange={(e) => handleFieldChange(index, 'options', e.target.value)}
                      placeholder="Comma-separated options"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleDeleteRow(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section to load an existing form */}
      <div className="container my-5">
        <h1 className="text-center mb-4">Load an Existing Form</h1>
        <div className="d-flex align-items-center justify-content-center">
          <label htmlFor="existing-form" className="me-3 fw-semibold">Select Existing Form</label>
          <select
            id="existing-form"
            name="existingForm"
            className="form-select me-3 border border-secondary"
            style={{ width: '200px' }}
            value={selectedForm}
            onChange={handleFormSelect}
          >
            <option value="" disabled>Select a form</option>
            {savedForms.map((form, index) => (
              <option key={index} value={form.formTitle}>
                {form.formTitle}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={handleExistingFormLoad}
            disabled={!selectedForm}
          >
            Generate Form
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
