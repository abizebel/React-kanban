import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
import {createIcon} from '../functions';
import '../ReactForm.css';
import './Modal.css';

class Modal extends Component {

    /**
     * Render modal sidebar
     */
    renderSidebar (){
        const {sidebar} = this.props;

        const sidebarItems =  sidebar.map((o, i) => {
            return (
                <li key={i} onClick={o.callback}>
                    {createIcon(o.icon)}
                </li>
            )
        });

        return  (<ul className="r-modal-sidebar">{sidebarItems}</ul>)
    }

    /**
     * Render buttons
     */
    renderButtons (){
        const {buttons, rtl} = this.props;
        return buttons.map((o, i) => {
            return (
                <li key={i} onClick={o.callback}>
                    <button type="button" className="r-button r-ripple r-xs r-defualt r-nospace"> 
                        {!rtl && o.icon && createIcon(o.icon) }
                        {o.text && o.text}
                        {rtl && o.icon && createIcon(o.icon)}
                    </button>
                </li>
            )
        })
    }


    render (){
        const {label, sidebar, onClose, isOpen, rtl, width} = this.props;
        const rtlClass = rtl ? ' r-rtl' : '';

        //Disbale body scroll when popup is open
        if (isOpen) {
            if(!$('body').hasClass('r-popup-open')) {
                $('body').addClass('r-popup-open')
            }
        }

        console.log(isOpen)
        return (
            <Fragment>
                <ReactCSSTransitionGroup 
                transitionName="fade" 

                transitionAppear={true}>
                   {isOpen && <div className="r-modal-backdrop"></div>} 
                </ReactCSSTransitionGroup>
               
                <ReactCSSTransitionGroup 
                transitionName={`slide-${rtl?'right':'left'}`} 
                transitionAppear={true}>
                    {isOpen && 
                    <div className={`r-modal${rtlClass}`} style={{width}}>
                        <div className="r-modal-header">
                            <div className="r-modal-title">{label}</div> 
                            <ul className="r-modal-buttons">
                                <li>
                                    <button onClick={() => {onClose(); $('body').removeClass('r-popup-open')}} type="button" className="r-button r-ripple r-xs r-defualt r-nospace"> 
                                        <span className="mdi mdi-close"></span>
                                    </button>
                                </li>
                                {this.renderButtons()}
                            </ul>
                        </div>

                        <div className="r-modal-body">
                            
                            {sidebar && this.renderSidebar()}

                            <div className="r-modal-content">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                    }
                </ReactCSSTransitionGroup>
                
            </Fragment>      
        )
    }
}

Modal.defaultProps = {
    rtl : false,
    buttons : [],
}

export default Modal