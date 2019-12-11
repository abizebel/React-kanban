import React, {Component} from 'react';
import CalendarContext from './CalendarContext';
import {persianNumber,mapPersianMonths } from './functions';

class DaysHeader extends Component {
    static contextType = CalendarContext;

    render () {
        const {nextMonth, prevMonth, setMode, month, jalali} = this.context;
        
        const jalaliMonthYear = mapPersianMonths(persianNumber(month.locale('fa').format('jMMMM jYYYY')));
        const georgianMonthYear = month.locale('en').format('MMMM YYYY');
        
        return (
            <div class="r-calendar-header">
                <div class="r-title" onClick={()=>{setMode('months')}}> 
                    {jalali ? jalaliMonthYear : georgianMonthYear} 
                </div>
                <div class="r-changer">

                    <button onClick={prevMonth} type="button" class="r-button r-xs r-rounded r-ripple r-nospace">
                        <svg viewBox="0 0 24 24" >
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    </button>

                    <button onClick={nextMonth} type="button" class="r-button r-xs r-rounded r-ripple r-nospace">
                        <svg viewBox="0 0 24 24" >
                            <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                        </svg>
                    </button>
                    
                </div>
            </div>
        )
    }
}


export default (DaysHeader)