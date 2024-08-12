import React from 'react';

function Range1(props) {
  const name = props.name;
  const value = props.value;

  const handleChange = (event) => {
    props.onChange(name, event.target.value);
  };

  return (
    <div className='range'>
      <div className='block_range'>
        <div className="name_d">
          {name}
        </div>
        <div className="name_b">
          {props.statments}
        </div>
        <div className='range_block'>
          <div className='lll'>0</div>
          <div>
            <input
              id={name}
              type="range"
              min="0"
              max="10"
              step="1"
              value={value}
              onChange={handleChange}
            />
          </div>
          <div className='llll'>10</div>
          <div className="value">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Range1;