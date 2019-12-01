import React, {Component} from 'react';
import icons from '../icons';
import '../ReactForm.css';
import './Chips.css';




class Chips extends Component {
    render (){
        const {values, mapping, onClose} = this.props;

        const chips = values.map((o, i ) => {
            return (
                <li key={i} className="r-chips-item" >{o[mapping.text]}
                    <span className="r-tag-icon" onClick={() =>{onClose(i)}}>{icons.close}</span>
                </li>
            )
        })

        return (
            <ul className="r-chips">{chips}</ul>
        )

    }
}


export default Chips