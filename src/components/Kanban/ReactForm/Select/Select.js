import React, {Component} from 'react';
import $ from 'jquery';
import Checkbox from '../Checkbox/Checkbox';
import {getValueByProp, createIcon, createUID} from '../functions';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import icons from '../icons';
import '../ReactForm.css';
import './Select.css';

class Select extends Component {
    constructor(props) {
        super(props);

        const {values , defaultValue} = this.props;
        //Our method always get array and when user send "String" should be convert to array
        this.selectedIds = (typeof defaultValue === 'number' ?  [defaultValue] : defaultValue) || [];
        this.values =  this.createList (values);
        const selectedItems =  this.getSelectedItems (this.selectedIds)
        
        this.state = {
            open : false,
            selectedItems :selectedItems,
            listValues : this.values,
            hasError : this.validate(selectedItems).hasError,
            errorMessage : this.validate(selectedItems).errorMessage,
            uid : createUID(),
            searchValue : ''
        }
    }

    componentDidMount(){
        const {uid} = this.state;

        $(document).click((e) => {
            let selectElement = $(e.target).closest('.r-select');

            /* *
             * When one dropdown is opened close another
             */

            if (selectElement.attr('data-id') !== uid) {
                this.setState({open : false})
            }

            /**
             * If select was open and clicked outside of it close it
             * length == 0 means that user clicked outside of select
             */
            if(selectElement.length === 0 && this.state.open === true){
               this.setState({open : false})
            }
        })
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
    validate (selectedItems = []){
        const {serverError, required} = this.props;
        let hasError = false;
        let errorMessage = '';

        if(!this.isValidationMode()) return {hasError,errorMessage} ;
       
        if(serverError && serverError.status) {
            hasError = true;
            errorMessage = serverError.message;
        }
        else if(!serverError && required && selectedItems.length === 0){
            hasError = true;
            errorMessage = required;
        }
 
        this.setState({hasError, errorMessage});
        return {hasError, errorMessage}
    }

    /**
     * Add Selected property to values that listed as options
     * 
     * @param {Array} values 
     */
    addSelectedProp (values){
        const {mapping, multi} = this.props;

        values.forEach(o =>{
            o.selected = false;
            if(multi && this.selectedIds.indexOf(Number(o[mapping.value])) !==-1){
                o.selected = true
            }
        });
    }

    /**
     * Create list for select options
     */
    createList (values){
        const {nullable, mapping,notSelectedText, rtl} = this.props;
        let listValues = [...values];
        
        this.addSelectedProp(listValues)
        
        //If nullable add a fake object 
        if (nullable) {
            const notSelected = notSelectedText ? notSelectedText : (rtl ? 'انتخاب نشده' : 'No Selected');

            listValues.unshift({
                [mapping.text] : notSelected,
                [mapping.value] : -99,
            })
        }

        return listValues;
    }

    /**
     * import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

     * @param {Number} id 
     * @description Find selected value by id for single select
     */
    getSelectedItems (id){
        const {mapping} = this.props;

        const selectedItems = this.values.filter(o => {
            return id.indexOf(Number(o[mapping.value])) !== -1

        });

        return selectedItems;
    }
    

    /**
     * Open popup
     * 
     * @param {Event} e 
     */
    open (e){
        const {disabled} = this.props;
        
        if (disabled) return;
        
        this.setState((prevState) => {
            return { open : !prevState.open}
        });
    }


    /**
     * Open popup
     * 
     * @param {Event} e 
     */
    toggle (e){
        const {disabled} = this.props;
        
        if (disabled) return;

        this.setState((prevState) => {
            return { open : !prevState.open}
        });
    }

    /**
     * Preventing add duplicate item to selected list
     * 
     * @param {Object} item
     * @returns {Boolean}
     */
    isExist (item){

        const {mapping} = this.props;
        const {selectedItems} = this.state;

        for (var i=0 ; i< selectedItems.length ; i++) {
            if(selectedItems[i][mapping.value] === item[mapping.value]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find item index in selected list
     * 
     * @param {Object} item
     * @returns {Boolean}
     */
    findItemIndex (item){
        const {mapping} = this.props;
        const {selectedItems} = this.state;

        for (var i=0 ; i< selectedItems.length ; i++) {
            if(selectedItems[i][mapping.value] === item[mapping.value]) {
                return i;
            }
        }

    }

    /**
     * Toggle select in multiselect mode 
     * 
     * @param {Object} item 
     */
    toggleSelect (item){
        const {change} = this.props;
        
        this.setState(prevState => {
            
            if(this.isExist(item)) {
                const itemIndex = this.findItemIndex(item);
                prevState.selectedItems.splice(itemIndex, 1 )
            }
            else {
                prevState.selectedItems.push(item);
            }
            
            this.validate(prevState.selectedItems)
            change(prevState.selectedItems)

            return {
                selectedItems : prevState.selectedItems
            }
        });
        
    }

    /**
     * Toggle options iwth index
     * 
     * @param {Number} index 
     */
    toggleOptions (index){
        this.setState(prevState => {

            prevState.listValues[index].selected = !prevState.listValues[index].selected;
            return {
                listValues : prevState.listValues
            }
        })
    }

    /**
     * Deselect all options
     */
    deselectOptions (){
        this.setState(prevState => {
            prevState.listValues.forEach(o => (o.selected = false))
            return {
                listValues : prevState.listValues
            }
        })
    }

    /**
     * 
     * @param {Object} item 
     * @description Select a item that user clicked on it 
     */
    select (item, index){
        const {change, mapping, multi} = this.props;

        /**
         * If user had selected "no item" send Null otherwise send selected object
         * Null item is {text : 'No Selected', value : -99}
         */
        if (item[mapping.value] === -99) {
            this.deselectOptions()
            this.setState({selectedItems : []});
            this.setState({open:false});
            this.validate([]);
            change(null);
            return;
        }
        
        if (multi){
            this.toggleOptions(index);
            this.toggleSelect(item) ;
        }
        else {
            this.setState({selectedItems : [item]})
            this.validate([item])
            this.setState({open:false});
            change(item);
     
        }
 
    }

    /**
     * Render select optionsmulti
     */
    renderOptions (){
        const {mapping, search ,notFoundMessage, rtl, multi} = this.props;
        const {listValues  } = this.state;
        let options;

        //If options list is empty show "Not Found"
        if (listValues.length === 0) {
            const notFoundText = notFoundMessage ? notFoundMessage : (rtl ? 'یافت نشد' : 'Not Found');
            options = (<div className="r-options-item">{notFoundText}</div>)
        }
        else {
            options = listValues.map((o, i) => {
                return (
                    <div key={i} className={`r-options-item`} onClick={this.select.bind(this,o,i)}>
                      
                        {multi && o[mapping.value] !==-99 &&
                            <Checkbox 
                                size={'xs'}
                                justViewMode={true} 
                                nospace={true} 
                                rtl={rtl} 
                                defaultValue={o.selected}
                            />
                        }

                        {mapping.icon && !multi &&
                            <span className="r-option-icon">
                                {createIcon(getValueByProp(o, mapping.icon))}
                            </span> 
                        }

                        {this.getItemText(o, '-')}
                    </div>
                )
            })
        }
        
        return (
            <div className="r-options">
                {search && this.renderSearch()}
                <div className="r-options-items">{options}</div>
            </div>
        )
        
    }

    /**
     * Search in select options
     * 
     * @param {Event} e 
     */
    search (e){
        const {mapping} = this.props;
        const value = e.target.value;

        //Store search value in state
        this.setState({searchValue : value})

        //Reset list if input hasnt value
        if(value.length === 0) {
            this.setState({listValues :this.values})
        }

        //Search
        const target = value.toLowerCase();
        const foundValues = this.values.filter(o => {
            return o[mapping.text].toLowerCase().indexOf(target)!== -1
        });

        this.setState({listValues : foundValues})
    }

    /**
     * Render options search  
     */
    renderSearch (){
        const {searchLabel, rtl} = this.props;
        const {searchValue} = this.state;
        const searchLableText = searchLabel ? searchLabel : (rtl ? 'جستجو ...' : 'Search ...')

        return (
            <div className="r-options-search">
                <input value={searchValue} onChange={this.search.bind(this)} placeholder={searchLableText} type="text" />
            </div>
        )
    }

    /**
     * Get list item value
     * 
     * @param {Object} item 
     * @param {String} seperator is between key and text
     * @returns {String}
     */
    getItemText (item, seperator = ""){
        const {mapping, showKey} = this.props;

        const text = item[mapping.text];
        const value = item[mapping.value];

        /**
         * Null item should not show key
         * Null item is {text : 'No Selected', value : -99}
         */
        const key = (showKey && value !== -99) ? `${value} ${seperator}`  : '' ;
        const itemText = `${key} ${text}`;

        return itemText;
    }

     /**
     * Get input value when single selecting
     * 
     * @param {Array} item 
     * @param {String} seperator is between key and text
     * @returns {String}
     */
    getInputText (){
        const {mapping, showKey, notSelectedText, rtl, multi} = this.props;
        const {selectedItems} = this.state
        let inputText = '';

        if (!selectedItems || selectedItems.length === 0) {
            const notSelected = notSelectedText ? notSelectedText : (rtl ? 'انتخاب نشده' : 'No Selected');
            return notSelected;
        }

        selectedItems.forEach((o,i) =>{
            const text = o[mapping.text];
            const value = o[mapping.value];
            const seperator = multi && selectedItems.length >1 && i>0 ? ' , ' : '';

            /**
             * Null item should not show key
             * Null item is {text : 'No Selected', value : -99}
             */
            const key = (showKey && value !== -99) ? `${value}`  : '' ;
            inputText += `${seperator}${key} ${text}`;

        })
        
        return inputText
    }



    render (){
        const { label, mapping, rtl, disabled, outline, multi} = this.props;
        const {errorMessage, hasError,open, selectedItems, uid} = this.state;

        const activeClass = open ? ' active' : '';
        const hasIconClass =  mapping.icon &&  !multi  ? ' r-has-icon' : '';
        const rtlClass = rtl ? ' r-rtl' : '';
        const outlineClass = outline ? ' r-bordered' :''; 
        const disabledClass = disabled ? ' r-disabled' :''; 
        const inputValue = this.getInputText();
        const renderIcon = mapping.icon ? createIcon(getValueByProp(selectedItems, mapping.icon)) : '';
        const validationMode = this.isValidationMode();
        const errorClass =  validationMode && hasError ? ' r-error' :''; 
      
        
        return (
            <div data-id={uid} className={`r-select r-noselect r-input filled${errorClass}${activeClass}${hasIconClass}${rtlClass}${outlineClass}${disabledClass}`}>
                <input 
                    onClick={this.toggle.bind(this)}
                    disabled={disabled} 
                    type="text" 
                    onChange={()=>{}} 
                    value={inputValue.trim()}   
                />
                <label>{label}</label>
                <span className="r-line"></span>
                {!multi && mapping.icon && <span className="r-input-icon">{renderIcon}</span>}
                <span onClick={this.open.bind(this)} className="r-icon">{icons.down}</span>
                             
                {   hasError &&
                    <span className="r-message">{errorMessage}</span> 
                }
                {/* <ReactCSSTransitionGroup 
                transitionName="fade" 
                transitionAppear={true}> */}
                    {open && this.renderOptions()}
                {/* </ReactCSSTransitionGroup> */}
              
            </div>
        )
    }
}

Select.defaultProps = {
    rtl : false,
    outline : false,
    disabled : false,
    nullable : false,
    multi : false,
    
}

export default Select