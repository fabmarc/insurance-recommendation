import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { keyBy, map } from 'lodash';
import { toInt } from '../../utils';

const List = styled.ul`
  list-style-type: none;
`;

const Item = styled.li`
  margin: 0 0 8px;
`;

const Label = styled.label`
`;

const Radio = styled.input.attrs({
  type: 'radio',
})`
`;

const Error = styled.div`
  margin: 4px 0 0 2px;
  font-weight: 500;
  font-size: 0.7em;
  color: #F00;
`;

export default function RadioGroup(props) {
  const { numeric, name, options, value: data, onChange, error } = props;

  const [value, setValue] = useState(data);

  const hashOptions = useRef();

  useEffect(() => { setValue(data); }, [data]);

  useEffect(() => {
    hashOptions.current = keyBy(options, 'value');
  }, [options]);

  function handleChange(event) {
    let { target: { value: radioValue } } = event;
    if (numeric) radioValue = toInt(radioValue);
    if (typeof onChange === 'function') {
      onChange(hashOptions.current[radioValue]);
    }
    setValue(radioValue);
  }

  return (
    <Fragment>
      <List data-testid="radio-list">
        {map(options, option => (
          <Item key={option.value}>
            <Label>
              <Radio
                name={name}
                value={option.value}
                onChange={handleChange}
                checked={option.value === value}
              />
                &nbsp;&nbsp;
                {option.label}
            </Label>
          </Item>
        ))}
      </List>
      {error && <Error>{error}</Error>}
    </Fragment>
  );
}

RadioGroup.propTypes = {
  numeric: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    label: PropTypes.oneOfType([PropTypes.string]),
  })),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func,
  error: PropTypes.string,
};
