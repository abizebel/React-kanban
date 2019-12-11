import React, {Component, createRef} from 'react';
import {getValueByProp, createIcon} from '../functions';
import Chips from '../Chips/Chips';
import '../ReactForm.css';
import './Tag.css';

class Tag extends Component {
    constructor(props){
        super(props);

        this.values = [...this.props.values];
        const defaultValues = this.props.defaultValue || [];
        const selectedTags = [...defaultValues] || [];

        this.state = {
            open : false,
            searchValue :  '',
            tags : selectedTags, // tags
            listValues :  this.values || [], //search list
            selectedItem : null,
            hasError : this.validate(selectedTags).hasError,
            errorMessage : this.validate(selectedTags).errorMessage,
        }

        this.inputDom = createRef()
    }

    handleChange (e){    
        const {disabled} = this.props;
        if (disabled) return ;

        this.setState({searchValue : e.target.value});
    }

    /**
     * Detect validation mode
     */
    isValidationMode (){
        const {required, serverError} = this.props;

        const validationMode =required || serverError ? true : false;
        return validationMode;
    }

    /**
     * Check if select has error or not depends on our configs
     * 
     */
    validate (selectedTags = []){
        const {serverError, required} = this.props;
        let hasError = false;
        let errorMessage = '';

        if(!this.isValidationMode()) return {hasError,errorMessage} ;
       
        if(serverError && serverError.status) {
            hasError = true;
            errorMessage = serverError.message;
        }
        else if(!serverError && required && selectedTags.length === 0){
            hasError = true;
            errorMessage = required;
        }
 
        this.setState({hasError, errorMessage});
        return {hasError, errorMessage}
    }


    /**
     * Render tag list for selection
     */
    renderOptions (){
        const {mapping} = this.props;
        const {listValues} = this.state;
        var options;

        if (listValues.length === 0) {
            options = (<div className="r-options-item">Not Found</div>)
        }

        else {
            options = listValues.map((o, i) => {
                return (
                    <div key={i} className="r-options-item" onClick={this.select.bind(this,o)}>
                        {mapping.icon && 
                            <span className="r-option-icon" onClick={this.removeTag.bind(this)}>
                                {createIcon(getValueByProp(o, mapping.icon))}
                            </span> 
                        }
                        {getValueByProp(o, mapping.text)}
                    </div>
                )
            })
        }
        
        return (
            <div className="r-options">
                <div className="r-options-items">{options}</div>
            </div>
        )
      
    }

    /**
     * Render tag list
     */
    renderTags (){
        const {tags} = this.state;
        const {mapping} = this.props;

        return (
            <Chips
                values={tags}
                onClose={this.removeTag.bind(this)}
                mapping={mapping}
            />
        )
    }

    /**
     * Select and and tag to tag list1
     * 
     * @param {Object} item 
     */
    select (item){
        this.setState({selectedItem:item})
        this.addTag(item)
        this.setState({open:false})
    }

    /**
     * Open tag list
     * 
     * @param {Event} e 
     */
    open (e){        
        this.setState({open : true})
    }

    /**
     * Close tag list
     */
    close (){
        setTimeout(()=>{
            this.setState({open : false})
        },500)
    }


    /**
     * Get searching tag results from server
     * 
     * @param {String} str 
     */
    async getTagFromServer (str){
        const {api} = this.props;
        return await api(str);
    }

    /**
     * Preventing add duplicate tag to tag list
     * 
     * @param {Object} tag
     * @returns {Boolean}
     */
    isExist (tag){
        const {mapping} = this.props;
        const {tags} = this.state;

        for (var i=0 ; i< tags.length ; i++) {
            if(tag[mapping.text] === tags[i][mapping.text]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add tag to the tag list
     * 
     * @param {Object} tag 
     */
    addTag (tag){
        const {change} = this.props;
        if (this.isExist(tag)) return ;

        this.setState((prevState) =>{
            prevState.tags.push(tag);
            this.validate(prevState.tags)
            change(prevState.tags);

            return {
                tags : prevState.tags
            }
        });
        
        this.setState({searchValue : ''})
    }
    
    /**
     * Remove tag from tag list
     * 
     * @param {Number} index 
     */
    removeTag (index){
        const {change,disabled} = this.props;

        if (disabled) return ;

        let {tags} = this.state
        tags.splice(index, 1 )
        this.setState({tags})
        this.validate(tags)
        change(tags)

    }

    /**
     * Press enter ky on keyboard
     * 
     * @param {Event} e 
     */
    enter (e){
        const {mapping} = this.props;

        if (e.keyCode === 13) {
            const value = this.inputDom.current.value;
            if (value.trim() === '') return;

            this.addTag({[mapping.text] : value});
            this.setState({open:false});

        }
       
    }

    /**
     * Search for a tag
     * 
     * @param {Evenet} e 
     */
    async search (e){
        const {api, mapping} = this.props;
        const target = e.target.value.toLowerCase();
        let foundValues ;

        //handle change
        this.handleChange(e);

       //Close if search value is empty
        if(e.target.value.length === 0) {
            this.setState({open : false})
            return;
        }
        
        //Remote search
        if(api){
            foundValues = await this.getTagFromServer(target);
        }
        //local search
        else { 
            foundValues = this.values.filter(o => {
                return o[mapping.text].toLowerCase().indexOf(target)!== -1
            });
        }
        
        //Update tag list
        this.setState({listValues : foundValues});

        //Open
        this.open(e)
    }

    render (){
        const {rtl, outline, label, disabled, mapping} = this.props;
        const {searchValue, open, tags, hasError, errorMessage} = this.state;
        const filledClass = (searchValue.length > 0 || tags.length >0) ? ' filled' :''; 
        const rtlClass = rtl ? ' r-rtl' :''; 
        const outlineClass = outline ? ' r-bordered' :''; 
        const disabledClass = disabled ? ' r-disabled' :''; 
        const activeClass = open ? ' active' : '';
        const hasIconClass =  mapping.icon ? ' r-has-icon' : '';
        const validationMode = this.isValidationMode();
        const errorClass =  validationMode && hasError ? ' r-error' :''; 
      

        return (
            <div className={`r-tag r-input${errorClass}${filledClass}${hasIconClass}${rtlClass}${outlineClass}${disabledClass}${activeClass}`} >
                {this.renderTags()}
                <input 
                    onBlur={this.close.bind(this)}
                    value={searchValue}
                    disabled={disabled}
                    ref={this.inputDom} type="text" 
                    onChange={this.search.bind(this)} 
                    onKeyUp={this.enter.bind(this)}
                />
                <label>{label}</label>
                <span className="r-line"></span>
                {   hasError &&
                    <span className="r-message">{errorMessage}</span> 
      
                }
                {this.open && this.renderOptions()}
            </div>
        )
    }
}

Tag.defaultProps = {
    rtl : false,
    outline : false,
    disabled : false,
    values : [],
}

export default Tag;