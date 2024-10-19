import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ExixtingForm = () => {

    const [savedForms, setSavedForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const forms = JSON.parse(localStorage.getItem('Forms')) || [];
        setSavedForms(forms);
    }, []);

    const handleExistingFormLoad = () => {
        const formData = savedForms.find((form) => form.formTitle === selectedForm);

        if (formData) {
            navigate('/generated-form', { state: { formData } });
        }
    };
    return (
        <>
            <div className="container my-5">
                <h1 className="text-center mb-4">Load an Existing Form</h1>
                <div className="d-flex align-items-center justify-content-center">
                    <label htmlFor="existing-form" className="me-3 fw-semibold">Select Existing Form</label>
                    
                    <select
                        id="existing-form"
                        name="existingForm"
                        className="me-3 border border-secondary"
                        style={{ width: '200px' }}
                        value={selectedForm}
                        onChange={(e) => setSelectedForm(e.target.value)}
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
    )
}

export default ExixtingForm