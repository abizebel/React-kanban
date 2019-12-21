import React, {Component, createRef} from 'react';
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from './Card';
import icons from './icons';
import KanbanContext from './KanbanContext';
import EditText from './EditText';
import ScrollArea from 'react-scrollbar';
import $ from 'jquery'


const getItemStyle = (isDragging, draggableStyle,height) => {
    return ({
        userSelect: "none",
        ...draggableStyle,
       height : height - 50,
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
        const {data} = this.props;

        addBoardItem({addText, index, ...data});
        this.setState({addText : ''});
        this.textareaDom.current.dom.current.focus();
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
        setTimeout(()=>{
            const h = $(this.scrollbarDom.current.wrapper).find('.scrollarea-content ').height()
            this.scrollbarDom.current.scrollArea.scrollYTo(h)
        },100)
      
    }

    keyUpTextarea (index, e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.addItem(index)
        }
        else if (e.keyCode === 27) {
            this.toggleAddMode()
        }
    }

    render () {
        const {title, subtitle, items, index, height} = this.props;
        const {addText, isAddMode} = this.state;
        const {mapping} = this.context;
        
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
                    height
                )}>


                <div className="r-board-header">
                    <div className="r-board-title">
                        {icons.objective} {title}
                    </div>
                    {/* <div className="r-board-subtitle">
                        {icons.kpi} {subtitle}
                    </div> */}
                    {/* <div className="r-board-actions">
                        {icons.more}
                    </div> */}
                </div>  

                <Droppable key={`droppableSubItem${index}`} droppableId={`droppable${index}`} type="droppableSubItem">
                    {(provided, droppableSnapshot) => (
                            <ScrollArea
                                speed={0.8}
                                horizontal={false}
                                ref={this.scrollbarDom}
                            >
                            <div className="r-board-list" 
                            style={getListStyle(droppableSnapshot.isDraggingOver)}     
                            ref={provided.innerRef}>  
                             
                                {items.map((item, i) => (
                                    <Card
                                        key = {String(index) + String(i)}
                                        title = {item[mapping.cardTitle]}
                                        id = {String(index) + String(i)}
                                        index = {i}
                                        data={item}
                                        parentIndex={index}
                                    />
                                ))}
                               
                                {   isAddMode &&

                                    <EditText
                                        ref={this.textareaDom}
                                        key = {String(index)}
                                        autoFocus = {true}
                                        keyUp={this.keyUpTextarea.bind(this, index)}
                                        change={this.changeTextarea} 
                                        value={addText}
                                        saveText = {'افزودن'}
                                        placeholder={'یک نام برای کارت وارد کنید'}
                                        add={this.addItem.bind(this, index)}
                                        close={this.toggleAddMode}
                                    />
                
                                }
                                {provided.placeholder}
                            </div>
                        </ScrollArea>
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