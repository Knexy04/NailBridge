import React from 'react';

global.count = 0;
function ButtonJudge(props) {
  let id = props.id;
  let last = props.last;
  if (id == last){
    if (global.count == 0){
      return (
        <div className='button_access'>
            <input type='submit'  value="Оценить" id="last"/>
        </div>
      );
    }
    else{
      return (
        <div className='button_access'>
            <input type='button' value="Назад" id="pass"/>
            <input type='submit' value="Оценить" id="last"/>
        </div>
      );
    }
  }
  else if (id == 1){
    global.count++;
    return (
      <div className='button_access'>
          <input type='button' value="Вперед" id="next"/>
      </div>
    );
  }
  else{
    global.count++;
    return (
      <div className='button_access'>
          <input type='button' value="Назад" id="pass"/>
          <input type='button' value="Вперед" id="next"/>
      </div>
    );
  }
  
}

export default ButtonJudge;