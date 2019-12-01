import React, {Component} from 'react';
import {createUID} from '../functions'
import '../ReactForm.css';
import './Toggle.css';



class Toggle extends Component{
    constructor (props) {
        super(props);
        this.UID = createUID();
        this.state = {
            toggleValue : this.props.value || false
        }
    }


    handleChange (e){
        const {change} = this.props;

        this.setState({toggleValue : e.target.checked});

        change(e.target.checked)
    }

    render () {
        const { rtl, size, disabled} = this.props;
        const {toggleValue} = this.state;
        const rtlClass = rtl ? ' rtl' : '';
        const sizeClass = size === 'xs' ? ' r-xs' : size === 'lg' ? 'r-lg' : '';

        return (
            <div className={`r-toggle${rtlClass}${sizeClass}`} >
                <input
                    disabled = {disabled}
                    onChange={this.handleChange.bind(this)}
                    type="checkbox" 
                    id={this.UID}
                    checked={toggleValue} 
                />
                <label htmlFor={this.UID} className="r-toggle-handler"></label>    
            </div>
        )
    }

}



Toggle.defaultProps = {
    rtl : false,
    disabled : false,
}

export default Toggle