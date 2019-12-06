import React, {Component, createRef} from 'react';
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from './Card';
import icons from './icons';
import KanbanContext from './KanbanContext';
import { Scrollbars } from 'react-custom-scrollbars';


const getItemStyle = (isDragging, draggableStyle) => {
    return ({
        userSelect: "none",
        ...draggableStyle
    })
};

const getListStyle = isDraggingOver => ({
    //#e2e4e9
   // background: isDraggingOver ? "#f1f2f4" : "#F6F7F8",
});

  
class Board extends Component {
    static contextType = KanbanContext
    

    state = {
        isAddMode : false,
        itemAdded : false,
        addText : ''
    }
    textareaDom = createRef();
    scrollbarDom = createRef();

    changeTextarea = (e) => {
        this.setState  ({addText : e.target.value})
    }
    addItem (index){
        const {addBoardItem} = this.context;
        const {addText} = this.state;

        addBoardItem(addText , index);
        this.setState({addText : ''});
        this.textareaDom.current.focus();
        this.setScrollDown ()

    }

    toggleAddMode = () =>{
        const {isAddMode} = this.state ;

        if (!isAddMode){
            this.setScrollDown ()
        }
        this.setState({isAddMode : !this.state.isAddMode})
    }

    setScrollDown (){
        const h = this.scrollbarDom.current.getScrollHeight()
        setTimeout(()=>{
            this.scrollbarDom.current.scrollTop(h)
        },10)
      
    }

    keyUp (index, e) {
        if (e.keyCode === 13) {
            this.addItem(index)
        }
    }

    render () {
        const {title, subtitle, items, index, actions, rtl} = this.props;
        const {addText, isAddMode} = this.state;
        
        return (
     
            <Draggable key={`droppable${index}`} draggableId={`droppable${index}`} index={index}>
            {(provided, snapshot) => (

            <div className="r-board" 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                )}>


                <div className="r-board-header">
                    <div className="r-board-title">
                        {icons.objective} {title}
                    </div>
                    <div className="r-board-subtitle">
                        {icons.kpi} {subtitle}
                    </div>
                    <div className="r-board-actions">
                        {icons.more}
                    </div>
                </div>  

                <Droppable key={`droppableSubItem${index}`} droppableId={`droppable${index}`} type="droppableSubItem">
                    {(provided, droppableSnapshot) => (
                        <Scrollbars ref={this.scrollbarDom} >
                            <div className="r-board-list" 
                            style={getListStyle(droppableSnapshot.isDraggingOver)}     
                            ref={provided.innerRef}>  
                             
                                {items.map((item, i) => (
                                    <Card
                                        key = {String(index) + String(i)}
                                        title = {item.title}
                                        id = {String(index) + String(i)}
                                        index = {i}
                                        parentIndex={index}
                                    />
                                ))}
                               
                                {   isAddMode &&
                                    <div  key = {String(index)} className="r-board-addarea" >
                                        <textarea 
                                            ref={this.textareaDom}
                                            autoFocus
                                            onKeyUp={this.keyUp.bind(this,index)}
                                            onChange={this.changeTextarea} value={addText}
                                            placeholder={'یک نام برای کارت وارد کنید'}
                                         >
                                         </textarea>

                                        <div className="r-board-addarea-actions">
                                            <button type="button" className="r-button r-ripple r-success r-nospace"  onClick={this.addItem.bind(this, index)}> افزودن </button>
                                            <button type="button" className="r-button r-ripple r-default r-nospace" onClick={this.toggleAddMode}> {icons.close} </button>
                                        </div>
                                    </div> 
                
                                }
                                {provided.placeholder}
                            </div>
                        </Scrollbars>
                    )}
                    
                </Droppable>   
                <div className="r-board-footer">
                    {   !isAddMode &&
                        <div className="r-board-add"  onClick={this.toggleAddMode}>
                        {icons.plus} افزودن کارت جدید
                        </div> 
                    }
                </div>
            </div>
            )}
            </Draggable>
            
        )
    }
}





export default Board