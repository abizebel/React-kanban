import React, {Component} from 'react';
import '../ReactForm.css';
import './Tabs.css';

class Tabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTabIndex : 0
        }
    }
    //1 - implement default active tab 0
    //2 - when change on active tab wish to load related contenmts 
    //3 - when change on active tab add class active to it

    /**
     * Change tab item
     * 
     * @param {Number} i 
     */
    changeTab (i){
        this.setState({activeTabIndex : i})
    }

    /**
     * Render tab list
     */
    renderTabList (){
        const {items} = this.props;
        const {activeTabIndex} = this.state;

        const list =  items.map((o, i) => {
            const activeClass = i === activeTabIndex ? 'active' : '';
            return (
                <li key={i} className={activeClass} onClick={this.changeTab.bind(this, i)}> 
                        <button type="button" class="r-button r-ripple r-nospace">{o.label}</button>
                </li>
            )
        });

        return (<ul class="r-tab-list">{list}</ul>);
    }

    /**
     * Render tab content
     */
    renderContent (){
        const {items} = this.props;
        const {activeTabIndex} = this.state;
        const activeItem = items[activeTabIndex];
        return activeItem.template(activeItem)
    }

    render (){
        const {rtl} = this.props;
        const rtlClass = rtl ? ' r-rtl' : '';
        return(
            <div class={`r-tab${rtlClass}`}>
                {this.renderTabList()}
                <div class="r-tab-content">
                    {this.renderContent()}
                </div>
            </div>
        )
    }
}

Tabs.defeaultProps = {
    rtl : false
}

export default Tabs;