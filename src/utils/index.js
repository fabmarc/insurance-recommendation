export function isBlank(value) {
  return !value && value !== false && value !== 0;
}

export function toInt(value, defaultValue = null) {
  if (isBlank(value)) return defaultValue;
  const parsed = parseInt(value, 10);
  return isBlank(parsed) ? defaultValue : parsed;
}

export function getNumberSymbols(locale = 'en') {
  const numberWithGroupAndDecimalSymbol = 1000.1;
  return Intl.NumberFormat(locale)
    .formatToParts(numberWithGroupAndDecimalSymbol)
    .reduce((init, part) => {
      const accum = init;
      accum[part.type] = part.value;
      return accum;
    }, {});
}

export function checkNumberTyping(
  value,
  { locale, grouping, decimals = 0 } = {},
) {
  const { group: groupingSymbol, decimal: decimalSymbol } = getNumberSymbols(
    locale,
  );
  const decimalsRegExp = `(\\${decimalSymbol}{${+!!decimals}}\\d{0,${decimals}})`;
  const groupingRegExp = `|([1-9]\\d{0,2}((\\${groupingSymbol}\\d{3})*\\${groupingSymbol}\\d{0,3}|(\\${groupingSymbol}\\d{3})*\\${groupingSymbol}\\d{3}${decimalsRegExp}))`;
  const regExp = new RegExp(
    `^-?((0?${decimalsRegExp}?|[1-9]\\d*${decimalsRegExp}?)${(grouping &&
      groupingRegExp) ||
      ''})$`,
  );
  return regExp.test(value);
}

export function formatCurrency(number, currency = 'USD', locale = 'en') {
  if (
    (typeof number === 'string' && number.trim() !== '') ||
    (number || number === 0)
  )
    return (+number).toLocaleString(locale, {
      style: 'currency',
      currency,
    });
  return '';
}
