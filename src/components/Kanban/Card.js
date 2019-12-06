import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Input} from './ReactForm';
import $ from  'jquery';
import KanbanContext from './KanbanContext';
import icons from './ReactForm/icons';

class Card extends Component {
    static contextType = KanbanContext;

    getCardStyle =  (isDragging, draggableStyle) => {  
        return  {
            userSelect: 'none',
          //  border:`1px solid ${isDragging ? '#2E5AE8' : '#CBCBCB'}` ,
            ...draggableStyle,
        }
    };
    
    state = {
        edit : false,
        textareaValue : this.props.title
    }



    static getDerivedStateFromProps (props, state) {
        if (props.title !== state.title ) {
            return {
                textareaValue : props.title
            }
        }
    }


    startEdit = e => {
        this.setState({edit : true});
 
    }

    endEdit = e => {
        this.setState({edit : false})
    }

    edit = val => {
        const {index, parentIndex} = this.props;
        const {updateBoardItem} = this.context;

        updateBoardItem(val, parentIndex, index)

    }
    remove = (e) =>{
        const {index, parentIndex} = this.props;
        const {removeBoardItem} = this.context;

        removeBoardItem(parentIndex, index)
    }
    keyUp = e => {
        if (e.keyCode === 13) {
            this.setState({edit : false})
        }
    }
    render (){
        const {id, parentIndex, index, title} = this.props;
        const {edit} = this.state;
        const {rtl} = this.context;
        
        return (
            <Draggable
                key={id}
                draggableId={id}
                index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`r-card ${edit && 'edit'}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={this.getCardStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}>
                        <div className="r-card-title">

                            {/* {   edit && 
                                <textarea 
                                    ref={this.textareaDom}
                                    autoFocus
                                    value={title}
                                    onChange={this.changeTextarea} 
                                    value={title}
                                >
                                </textarea>
                            } */}
                            {!edit && title}
                        </div>
                        <div className="r-card-actions" >
                            <div className="r-card-edit" onClick={this.startEdit}>{icons.edit}</div>
                            <div className="r-card-close" onClick={this.remove}>{icons.close}</div>
                        </div>

                    </div>

                )}
            </Draggable>
        )
    }
}


export default Card