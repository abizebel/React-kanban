import React , {Component, createRef} from 'react';

import icons from './icons';
import '../ReactForm/ReactForm.css'



class EditText extends Component {
    constructor (props) {
        super(props);
        this.dom = createRef();
        const {value = ''} = this.props;
        this.state = {
            text : value
        }
    }


    handleChange = e => {
        const {change} = this.props;
        this.setState({text : e.target.value})
        change(e)
    }

    render (){
        const { add, close, value, keyUp, autoFocus,placeholder, saveText} = this.props;
        const {text} = this.state;
        return (
            <div className="r-board-addarea" >
                <textarea 
                    ref={this.dom}
                    autoFocus = {autoFocus}
                    onKeyDown={keyUp}
                    onChange={this.handleChange}
                    value={text}
                    placeholder={placeholder}>
                </textarea>

                <div className="r-board-addarea-actions">
                    <button type="button" className="r-button r-ripple r-success r-nospace"  onClick={add}> {saveText} </button>
                    <button type="button" className="r-button r-ripple r-default r-nospace" onClick={close}> {icons.close} </button>
                </div>
            </div> 
        )
    }
}

EditText.defaultProps = {
    autoFocus : false,
}
export default EditText 