import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from './Card';
import icons from './icons';
import KanbanContext from './KanbanContext';


const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    ...draggableStyle
});
  
class Board extends Component {
    static contextType = KanbanContext
    render () {
        const {title, subtitle, items, index, actions, rtl} = this.props;
        const {addBoardItem} = this.context;
        
        return (
            <Draggable key={`droppable${index}`} draggableId={`droppable${index}`} index={index}>
            {(provided, snapshot) => (

            <div className="r-board" 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
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
                    {(provided) => (
                        <div className="r-board-list" ref={provided.innerRef}>  
                            {items.map((item, i) => (
                                <Card
                                    key = {String(index) + String(i)}
                                    title = {item.title}
                                    id = {String(index) + String(i)}
                                    index = {i}
                                    parentIndex={index}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                    
                </Droppable>   
               

                <div className="r-board-footer">
                    <div className="r-board-add-cart" onClick={()=>{addBoardItem(index)}}>
                        {icons.plus} افزودن کارت جدید
                    </div>
                </div>
            </div>
            )}
            </Draggable>
            
        )
    }
}





export default Board