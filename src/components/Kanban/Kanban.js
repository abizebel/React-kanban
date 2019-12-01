import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';
import {move, reorder} from './Functions';
import Board from './Board';
import './Kanban.css';
import KanbanContext from './KanbanContext';


class Kanban extends Component {
    static getDerivedStatesFromProps (props , state) {
        if (JSON.stringify(props.data) !== JSON.stringify(state.boards)) {
            return {
                boards : props.data
            }
        }
    }

    state = {
        boards : this.props.data
    };

    addBoard  (title)  {

    }

    addBoardItem  (i)  {
        let boards = Array.from(this.state.boards);
        boards[i].items.push({ title : ''});
        this.setState(boards)
    }
    updateBoardItem (val, parentIndex, index){
        let boards = Array.from(this.state.boards);
        boards[parentIndex].items[index].title = val
        this.setState(boards)        
    }
    removeBoardItem (parentIndex, index){
        let boards = Array.from(this.state.boards);
        boards[parentIndex].items.splice(index, 1)
        this.setState(boards)    
    }


    onDragEnd = result => {
        const { source, destination } = result;
        const {change} = this.props;

        if (!destination) {
            return;
        }


        if (result.type === "droppableItem") {
            const boards = reorder(
                this.state.boards,
                source.index,
                destination.index
            );

            this.setState({boards});
            change(boards)
        }
        else if (result.type === "droppableSubItem") {
            if (source.droppableId === destination.droppableId) {
                const id  = source.droppableId[source.droppableId.length - 1];
                const result = reorder(
                    this.state.boards[id].items,
                    source.index,
                    destination.index
                );
    
                this.setState(prevState => {
                    prevState.boards[id].items = result;
                    change(prevState.boards)
                    return {boards : prevState.boards}
                });
               
            } else {
                const sourceId  = source.droppableId[source.droppableId.length - 1];
                const desId  = destination.droppableId[destination.droppableId.length - 1];
                
                const result = move(
                    this.state.boards[sourceId].items,
                    this.state.boards[desId].items,
                    source,
                    destination
                );
    
                this.setState(prevState => {
                    prevState.boards[sourceId].items = result[`droppable${sourceId}`];
                    prevState.boards[desId].items = result[`droppable${desId}`];
                    change(prevState.boards)
                    return {boards : prevState.boards}
                });
    
            }
        }

        
    }

    getListStyle =  (isDragging, draggableStyle) => ({
        userSelect: 'none',
        ...draggableStyle,
   
    });

    render() {
        const {rtl} = this.props;
        const {boards} = this.state;
        const rtlClass = rtl ? 'r-rtl' : '';
        const contextValue = {
            rtl,
            addBoardItem : this.addBoardItem.bind(this),
            updateBoardItem : this.updateBoardItem.bind(this),
            removeBoardItem : this.removeBoardItem.bind(this),
        }


        return (
            <KanbanContext.Provider value={contextValue}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable direction={'horizontal'} droppableId="droppable" type="droppableItem">
                        {(provided, snapshot) => (
                            <div className={`r-kanban ${rtlClass}`}
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    boards.map((o, i) =>{
                                        return (
                                            <Board 
                                                rtl={rtl}
                                                id={o.id}
                                                items={o.items}
                                                title={o.title} 
                                                subtitle={o.subtitle}
                                                index={i}
                                                key={i}
                                            />
                                        )
                                    })
                                }
                            {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </KanbanContext.Provider>
            
        );
    }
}



export default Kanban