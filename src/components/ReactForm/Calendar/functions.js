const latinToPersianMap = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
const latinNumbers = [/1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g, /0/g];
const monthMapping = {
  Farvardin : 'فروردین',
  Ordibehesht : 'اردیبهشت',
  Khordaad : 'خرداد',
  Tir : 'تیر',
  Amordaad : 'مرداد',
  Shahrivar : 'شهریور',
  Mehr : 'مهر',
  Aabaan : 'آبان',
  Aazar : 'آذر',
  Dey : 'دی',
  Bahman : 'بهمن',
  Esfand : 'اسفند',

}

export function mapPersianMonths (date){
  for (let prop in monthMapping) {
    if (date.indexOf(prop) !== -1) {
      return date.replace(prop,monthMapping[prop] )
    }
  }

}

export function getDaysOfMonth(month, isJalali) {
  const days = [];

  const monthFormat = isJalali? 'jMonth' : 'Month';
  const dayOffset = isJalali ? 1 : 0;

  const current = month.clone().startOf(monthFormat);
  const end = month.clone().endOf(monthFormat);

  // Set start to the first day of week in the last month
  current.subtract((current.day() + dayOffset) % 7, 'days');

  // Set end to the last day of week in the next month
  end.add(6 - ((end.day() + dayOffset) % 7), 'days');

  while (current.isBefore(end)) {
    days.push(current.clone());
    current.add(1, 'days');
  }

  return days;
}


function prepareNumber(input) {
  let string;
  if (typeof input === 'number') {
    string = input.toString();
  } else if (typeof input === 'undefined') {
    string = '';
  } else {
    string = input;
  }

  return string;
}

function latinToPersian(string) {
  let result = string;

  for (let index = 0; index < 10; index++) {
    result = result.replace(latinNumbers[index], latinToPersianMap[index]);
  }

  return result;
}

export function persianNumber(input) {
  return latinToPersian(prepareNumber(input));
}

export function checkToday(compare) {
  const today = new Date();
  const todayString =
    String(today.getFullYear()) +
    addZero(String(today.getMonth() + 1)) +
    addZero(String(today.getDate()));

  return compare === todayString;
}

export function addZero(val) {
  val = Number(val);
  if (val < 10) return `0${val}`;
  return val;
}

