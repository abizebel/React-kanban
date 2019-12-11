import React, {Component, Fragment, createRef} from 'react';
import {createIcon} from '../functions';
import icons from '../icons';
import $ from 'jquery';
import '../ReactForm.css';
import './Input.css';


class Input extends Component {
    constructor (props) {
        super(props);
        this.textareaDom = createRef();
        this.state = {
            value : this.props.value || '',
            hasError : this.validate(this.props.value).hasError,
            errorMessage : this.validate(this.props.value).errorMessage
        }
 
    }



    componentDidMount(){
        $.each($('textarea[data-autoresize]'), function() {
            var offset = this.offsetHeight - this.clientHeight;
            var resizeTextarea = function(el) {
                $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            $(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
        });

        
    }

    /**
     * Handle input changes
     * 
     * @param {Event} e 
     */
    handleChange (e){
        const {change} = this.props;
        let value = e.target.value;
        
        this.setState({value});

        this.validate(value)

        change(value)
    }

    /**
     * Check if input has error or not depends on our configs
     * 
     */
    validate (value = ''){
        const {serverError, required, regex} = this.props;
        let hasError = false;
        let errorMessage = '';

        if(!this.isValidationMode()) return {hasError,errorMessage} ;

 
       
        if(serverError && serverError.status) {
            hasError = true;
            errorMessage = serverError.message;
        }
        else if(!serverError && required && value.trim() === ''){
            hasError = true;
            errorMessage = required;
        }
        else if (!serverError && regex) {
            hasError = !regex.pattern.test(value);
            errorMessage = regex.message;     
        }
 
        this.setState({hasError, errorMessage});
        return {hasError, errorMessage}
    }

    /**
     * Detect validation mode
     */
    isValidationMode (){
        const {required, serverError, regex} = this.props;

        const validationMode = required || serverError || regex ? true : false;
        return validationMode;
    }

    render (){
        const {rtl, outline, label, disabled, multiline, icon, onFocus, onBlur, autoFocus, onKeyUp} = this.props;
        const {value, hasError, errorMessage} = this.state;
        const filledClass = String(value).length > 0 || disabled ? ' filled' :''; 
        const rtlClass = rtl ? ' r-rtl' : ''; 
        const outlineClass = outline ? ' r-bordered' :''; 
        const disabledClass = disabled ? ' r-disabled' :''; 
        const iconClass = icon !== null ? ' r-has-icon' :''; 
        const inputIcon = createIcon(icon);
        const validationMode = this.isValidationMode ();
        const errorClass =  validationMode && hasError ? ' r-error' :''; 
        const sucessClass = validationMode && !hasError ? ' r-success' :''; 
      


        return (
            <div className={`r-input${filledClass}${rtlClass}${outlineClass}${disabledClass}${errorClass}${sucessClass}${iconClass}`} >  
                
                {   multiline ? 
                    <textarea 
                        onKeyUp={onKeyUp}
                        autoFocus={autoFocus}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        data-autoresize
                        ref={this.textareaDom}
                        type="text" 
                        value={value}
                        onChange={this.handleChange.bind(this)}
                        disabled = {disabled}
                    ></textarea>:
                    <input 
                        onKeyUp={onKeyUp}
                        autoFocus={autoFocus}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        type="text" 
                        value={value}
                        onChange={this.handleChange.bind(this)}
                        disabled = {disabled}
                    />
                }
                
                {label && <label>{label}</label>}

                {   icon !== null &&
                    <span className="r-input-icon">{inputIcon}</span>
                }
                 
                {   validationMode && hasError &&
                    <Fragment>
                        <span className="r-icon">{icons.error}</span>  
                        <span className="r-message">{errorMessage}</span> 
                    </Fragment>     
                }

                {   validationMode && !hasError &&
                    <span className="r-icon">{icons.success}</span>  
                }
                
                
            </div>
        )
    }

}

Input.defaultProps = {
    autoFocus : false,
    rtl : false,
    outline : false,
    disabled : false,
    multiline: false,
    icon : null,
}

export default Input