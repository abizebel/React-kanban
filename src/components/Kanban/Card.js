import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Input} from './ReactForm';
import $ from  'jquery';
import KanbanContext from './KanbanContext';
import icons from './ReactForm/icons';

class Card extends Component {
    static contextType = KanbanContext;

    getItemStyle =  (isDragging, draggableStyle) => ({
        userSelect: 'none',
        border:`1px solid ${isDragging ? '#2E5AE8' : '#CBCBCB'}` ,
        ...draggableStyle
    });
    
    state = {
        edit : false
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
                        onDoubleClick={this.startEdit}
                        onBlur={this.endEdit}
                        className={`r-card ${edit && 'edit'}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={this.getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}>
                        <div className="r-card-title">
                            {   edit && 
                                <Input
                                    rtl = {rtl}
                                    value = {title}
                                    autoFocus={true}
                                    change = {this.edit}
                                    onBlur = {this.endEdit}
                                    onFocus = {this.startEdit}
                                    onKeyUp={this.keyUp}
                                />
                            }
                            {!edit && title}
                        </div>
                        {!edit && <div className="r-card-close" onClick={this.remove}>{icons.close}</div>}
                    </div>

                )}
            </Draggable>
        )
    }
}


export default Card