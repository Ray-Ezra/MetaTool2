import React, { useState } from 'react';
import Form1 from './Form1';
import Form2 from './Form2';
import Form4 from './Form4';
import Form6 from './Form6/Form6';

const FormDisplay = () => {
  const [currentForm, setCurrentForm] = useState(1);  
  const [formData, setFormData] = useState({
    form1data: {},
    form2data: {},
    form3data: {
      token:[]
    },
  });

  const handleNextForm = (nextForm, data) => {
    console.log(`Received form${nextForm} data:`, data);
    setFormData((prevData) => ({
      ...prevData,
      [`form${nextForm}Data`]: data,
    }));
    setCurrentForm(nextForm);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
        <div className="form-carousel" style={{}}>
          {currentForm === 1 && <Form1 onNextForm={handleNextForm} />}
          {currentForm === 2 && (
            <>
              <Form2 onNextForm={handleNextForm} />
            </>
          )}
          {currentForm === 4 && <Form4 formData={formData} />}
          {currentForm === 6 && <Form6 onNextForm={handleNextForm} />}
        </div>
      </div>    
    </>
  );
};

export default FormDisplay;
