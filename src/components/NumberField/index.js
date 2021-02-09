import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { checkNumberTyping } from '../../utils';
import { locale } from '../../config';

const InputNumber = styled.input.attrs({
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
  color: #f00;
`;

export default function NumberField(props) {
  const {
    value: number,
    onChange,
    grouping,
    decimals,
    error,
    ...other
  } = props;

  const [value, setValue] = useState(number || '');

  useEffect(() => {
    setValue(number || '');
  }, [number]);

  function handleChange(event) {
    const {
      target: { value },
    } = event;
    if (
      typeof onChange === 'function' &&
      checkNumberTyping(value, { locale, grouping, decimals })
    ) {
      onChange({ value });
      setValue(value);
    }
  }

  return (
    <Fragment>
      <InputNumber value={value} onChange={handleChange} {...other} />
      {error && <Error>{error}</Error>}
    </Fragment>
  );
}

NumberField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  decimals: PropTypes.number,
  grouping: PropTypes.bool,
};
