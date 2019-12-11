import React, {Component, createRef} from 'react';
import '../ReactForm.css';
import './Checkbox.css';


class Checkbox extends Component {
    constructor(props){
        super(props);
        this.inputDom = createRef();
        this.state = {
            checked : this.props.defaultValue || false,
        }
    }

    static getDerivedStateFromProps(props,state){
        if(props.defaultValue !== state.checked){
            return {
                checked:props.defaultValue
            }
        }
        return null;
    }

    handleChange (e){
        const {change, justViewMode} = this.props;

        if(justViewMode) return;

        this.setState(prevState => {
            return {
                checked : !prevState.checked
            }
        })   

        change(e.target.checked)
    }
    render (){
        const {disabled, rtl, label, size, nospace, justViewMode,defaultValue} = this.props;
        const {checked} = this.state;
        const rtlClass = rtl ? ' r-rtl' : '';
        const disabledClass = disabled ? ' r-disabled' :''; 
        const sizeClass = size === 'xs' ? ' r-xs' : size === 'lg'? ' r-lg' : '';
        const noSpaceClass = nospace ? ' r-nospace' : '';
        const checkboxValue = justViewMode ? defaultValue : checked;
        const checkboxDisabledMode = justViewMode?  justViewMode : disabled;

        return (
            <div className={`r-checkbox${rtlClass}${noSpaceClass}${disabledClass}${sizeClass}`}>
                <label>
                    <input 
                        disabled={checkboxDisabledMode} 
                        ref={this.inputDom} 
                        onChange={this.handleChange.bind(this)} type="checkbox"
                        checked={checkboxValue}
                    />
                    <span className="r-checkbox-fake">    
                        <span className="check"></span>
                    </span> 
                    <span className="r-checkbox-text">{label}</span>
                </label>
            </div>
        )

    }
}

Checkbox.defaultProps = {
    rtl : false,
    disabled : false,
    nospace : false,
    justViewMode : false,
}

export default Checkbox
