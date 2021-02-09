import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputText = styled.input.attrs({
  type: 'text',
})`
  height: 32px;
  padding: 5px;
  width: 100%;
  border: 1px solid #e4e4e4;
  font-size: 0.9em;
`;

const Error = styled.div`
  margin: 4px 0 0 2px;
  font-weight: 500;
  font-size: 0.7em;
  color: #F00;
`;

export default function TextField(props) {
  const { value: text, onChange, error, ...other } = props;

  const [value, setValue] = useState(text || '');

  useEffect(() => { setValue(text || ''); }, [text]);

  function handleChange(event) {
    const { target: { value } } = event;
    if (typeof onChange === 'function') onChange({ value });
    setValue(value);
  }

  return (
    <Fragment>
      <InputText
        value={value}
        onChange={handleChange}
        {...other}
      />
      {error && <Error>{error}</Error>}
    </Fragment>
  );
}

TextField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
};
