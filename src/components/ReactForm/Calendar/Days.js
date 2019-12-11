import React, {Component} from 'react';
import {getDaysOfMonth, persianNumber, checkToday } from './functions';
import calendarContext from './CalendarContext';

const weekNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const jalaliWeekNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

class Days extends Component {
    static contextType = calendarContext;

    selectDay = selectedDay => {
        const { jalali,setMonth, change } = this.context;
        
        const selectedValue = jalali ? persianNumber(selectedDay.format('jYYYY/jM/jD')) :selectedDay.format('YYYY/M/D') ;
        
        setMonth(selectedDay);
        change(selectedDay._d)
    }

    renderDays (){
        const {month, jalali} = this.context;
        const dayList = getDaysOfMonth(month,jalali);
        const monthFormat = jalali ? 'jMM' : 'MM';

        return dayList.map((day,i) => {
            const disabled = day.format(monthFormat) !== month.format(monthFormat);
            const disabledClass = disabled ? 'r-disabled' : ''
            const todayClass = checkToday(day.format('YYYYMMDD')) ? 'r-today' : ''
            return ( 
                <div onClick={this.selectDay.bind(this,day)} key={i} class={`r-calendar-item ${disabledClass} ${todayClass}`}>
                    <span> {jalali ? persianNumber(day.format('jD')) : day.format('D')} </span>
                </div>
            )
        });
    }


    renderWeeks () {
        const {jalali} = this.context;
        const resultWeekNames = jalali ? jalaliWeekNames :weekNames;

        return resultWeekNames.map((name, i) => {
            return (
                <div key={i} class="r-calendar-item r-week">
                    <span>{name}</span>
                </div>       

            )
        })
    }

   render (){
       return (
        <div class="r-calendar-content">
            {this.renderWeeks()}
            {this.renderDays()}
        </div>
       )
   }
}


export default Days