
import React, { useState } from 'react';
import ReturnName from "./ReturnName";
import Range1 from "./range_1";

const Judge = (props) => {
  let categories = props.categories;
  
  function retItems(categories) {
    let categories_many = categories.split(', ');
    let items = [];
    for (let i = 0; i < categories_many.length; i += 3) {
      items.push(categories_many.slice(i, i + 3));
    }
    return items;
  }
  
  let items = retItems(categories);
  
  const [step, setStep] = useState(0);
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const previousStep = () => {
    setStep(step - 1);
  };
  
  function returnPage() {
      let index = step;
      return <Range1 name={items[index]} id={index} check={items.length} />;
  }
  
  return(
    <div className='judge_model'>
      <div>
        <ReturnName name={props.name}/>
        <div>
          {returnPage()}
        </div>
        <div className='button_access'>
          {step > 0 && <input type='button' onClick={previousStep} value="Назад" id="pass"/>}
          {step < items.length-1 && <input type='button' onClick={nextStep} value="Далее" id="next"/>}
          {step === items.length-1 && <input type='submit' value="Оценить" id="last"/>}
        </div>
      </div>
    </div>
  );
}

export default Judge;