import React, { useState } from "react";
function RangeInput(props) {
    const [value, setValue] = useState(5);
    function handleChange(event) {
        setValue(event.target.value);
      }
  return (
    <input id={props.id} type="range" min="0" max="10" step="1" value={value} onChange={handleChange} />
  );
}

export default RangeInput;