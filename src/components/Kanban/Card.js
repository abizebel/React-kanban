import React, {Component} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import KanbanContext from './KanbanContext';
import EditText from './EditText';
import icons from './icons';

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
        textareaValue : this.props.title,
    }



    // static getDerivedStateFromProps (props, state) {
    //     if (props.title !== state.title ) {
    //         return {
    //             textareaValue : props.title
    //         }
    //     }
    // }


    startEdit = e => {
        this.setState({edit : true});
    }

    changeValue  = e => {
        this.setState({textareaValue : e.target.value})
    }

    cancelEdit = () => {
        const {index, parentIndex, title} = this.props;
        const {updateBoardItem} = this.context;
        updateBoardItem(title, parentIndex, index);
        this.setState({edit : false});
    }

    edit = () => {
        const {index, parentIndex} = this.props;
        const {updateBoardItem} = this.context;
        const {textareaValue} = this.state;
        debugger
        updateBoardItem(textareaValue, parentIndex, index);
        this.setState({edit : false});

    }
    remove = (e) =>{
        const {index, parentIndex} = this.props;
        const {removeBoardItem} = this.context;

        removeBoardItem(parentIndex, index)
    }
    keyUp = e => {
        if (e.keyCode === 13) {
            this.edit()  
        }
        else if (e.keyCode === 27) {
            this.cancelEdit()
        }
    }
    render (){
        const {id, index, title} = this.props;
        const {edit, textareaValue} = this.state;
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

                        {   edit && 
                            <EditText
                                ref={this.textareaDom}
                                key = {String(index)}
                                autoFocus = {true}
                                keyUp={this.keyUp}
                                change={this.changeValue} 
                                value={textareaValue}
                                saveText = {'ذخیره'}
                                placeholder={'یک نام برای کارت وارد کنید'}
                                add={this.edit}
                                close={this.cancelEdit}
                            />
                        }
                        {   !edit &&
                            <div className="r-card-wrapper">

                                <div className="r-card-title">
                                    { title}
                                </div>
                                <div className="r-card-actions" >
                                    <div className="r-card-edit" onClick={this.startEdit}>{icons.edit}</div>
                                    <div className="r-card-close" onClick={this.remove}>{icons.close}</div>
                                </div>
                            </div>  
                        }   


                    </div>

                )}
            </Draggable>
        )
    }
}


export default Card