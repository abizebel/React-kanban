import React, {Component} from 'react';
import calendarContext from './CalendarContext';
import moment from 'moment-jalaali';


// List of months
const jalaliMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
  ];
  
  const georgianMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  

class Days extends Component {
    static contextType = calendarContext;

    selectMonth (monthNumber){
        const {setMonth, setMode, jalali, year} = this.context;
        const yearFormat =  jalali ? 'jMM/jYYYY/jDD' : 'MM/YYYY/DD' ;
        const key = `${monthNumber}-${year.format(yearFormat)}`;
        setMonth (moment(key, yearFormat));
        setMode('days');
    }
    
    renderMonths (){
        const {jalali,year, month} = this.context;
        const months = jalali ? jalaliMonths : georgianMonths;
        const yearFormat = jalali ?  'jYYYY' : 'YYYY' ;
        const monthYearFormat = jalali ? 'jM-jYYYY' : 'M-YYYY' ;

     
        return months.map((monthItem,i) => {
            const monthItemStr = `${i + 1}-${year.format(yearFormat)}`;
            const currentMonthStr = month.format(monthYearFormat);
            const currentClass = monthItemStr === currentMonthStr ? 'r-currentMonth' : '';
    
            return ( 
                <div key={i} 
                    onClick={this.selectMonth.bind(this,i+1)} 
                    class={`r-calendar-item r-month ${currentClass}`}>
                        <span>{monthItem}</span>
                </div>
            )
        });
    }


   render (){
       return (
        <div class="r-calendar-content">
            {this.renderMonths()}
        </div>
       )
   }
}


export default Days