import React, { useState } from 'react';

const FormPage1 = ({ nextStep }) => {
  const [data, setData] = useState('');

  const handleNext = () => {
    nextStep(data);
  };

  return (
    <div>
      <h2>Страница 1</h2>
      ххххххххххххх
      <button onClick={handleNext}>Далее</button>
    </div>
  );
};

const FormPage2 = ({ previousStep, nextStep }) => {
  const [moreData, setMoreData] = useState('');

  const handlePrevious = () => {
    previousStep();
  };

  const handleNext = () => {
    nextStep(moreData);
  };

  return (
    <div>
      <h2>Страница 2</h2>
      <input type="text" value={moreData} onChange={handleChange} />
      <button onClick={handlePrevious}>Назад</button>
      <button onClick={handleNext}>Далее</button>
    </div>
  );
};

const FormPage3 = ({ previousStep, formData }) => {
  const handlePrevious = () => {
    previousStep();
  };

  return (
    <div>
      <h2>Страница 3</h2>
      <p>Данные страницы 1: {formData.data}</p>
      <p>Данные страницы 2: {formData.moreData}</p>
      <button onClick={handlePrevious}>Назад</button>
    </div>
  );
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (data) => {
    setStep(step + 1);
    setFormData({ ...formData, ...data });
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && <FormPage1 nextStep={nextStep} />}
      {step === 2 && (
        <FormPage2 previousStep={previousStep} nextStep={nextStep} />
      )}
      {step === 3 && (
        <FormPage3 previousStep={previousStep} formData={formData} />
      )}
    </div>
  );
};

export default MultiStepForm;