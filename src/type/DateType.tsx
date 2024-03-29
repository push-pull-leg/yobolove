type d = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;
type YYYY = `1${d}${d}${d}` | `2${d}${d}${d}`;

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;

type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;

// @ts-ignore
type DateType = `${YYYY}-${MM}-${DD}`;
export default DateType;
