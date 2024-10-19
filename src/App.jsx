import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import ExixtingForm from './ExixtingForm';

function App() {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [fileFormat, setFileFormat] = useState('JSON');
  const navigate = useNavigate();

  const handleAddRow = () => {
    setFields([...fields, { name: '', type: 'String', mandatory: false, options: '' }]);
  };

  const handleSaveFile = () => {
    const formData = {
      formTitle,
      fields
    };

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
    a.download = `${formTitle}.${fileExtension}`;
    a.click();
  };

  const handleLoadFile = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (fileFormat === 'JSON') {
        const jsonData = JSON.parse(e.target.result);
        setFormTitle(jsonData.formTitle);
        setFields(jsonData.fields);
      }
      else if (fileFormat === 'XML') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
        const title = xmlDoc.getElementsByTagName("formTitle")[0].textContent; // extracts the formTitle element from the XML and retrieves its text content.
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

  const handleGenerateForm = () => {
    if (!formTitle.trim()) {
      alert('Please enter a Form Title before generating the form.');
      return;
    }

    const savedForms = JSON.parse(localStorage.getItem('Forms')) || [];
    const existingForm = savedForms.find((form) => form.formTitle === formTitle);

    if (existingForm) {
      alert(`Form with the title "${formTitle}" already exists! Please choose a different title.`);
      return;
    }

    const formData = {
      formTitle,
      fields
    };
    savedForms.push(formData);
    localStorage.setItem('Forms', JSON.stringify(savedForms));

    navigate('/generated-form', { state: { formData } });
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = fields.map((val, key) => (key === index ? { ...val, [field]: value } : val));
    setFields(updatedFields);
  };

  const handleDeleteRow = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="form-container">
        <h1>Create a form with Fields</h1>
        <div className="button-row">

          <button onClick={handleAddRow}>Add row</button>
          <button onClick={handleSaveFile}>Save {fileFormat}</button>

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

          <button onClick={handleGenerateForm}>Generate Form</button>
        </div>

        <div className="form-title d-flex align-items-center justify-content-center mt-4">
          <label>Form Title</label>
          <input
            type="text"
            placeholder="Enter form title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            style={{ width: '90%' }}
          />
        </div>

        <div >
          <label className='mx-2'>
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

        <table className='table table-bordered table-striped my-4'>
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
                  <button onClick={() => handleDeleteRow(index)} className='btn btn-danger'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExixtingForm />
      
    </>
  );
}

export default App;
