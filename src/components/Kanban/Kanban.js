import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Board from './Board';
import KanbanContext from './KanbanContext';
import './Kanban.css';

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
    }

    addBoard (title) {}

    /**
     *
     * @returns {Object} from callback
     * {status : Boolean, id : Number }
     */
    async addBoardItem  (obj)  {
        const {api, mapping} = this.props;
        const {addText, index} = obj;
        const res = await api.addCard(obj)

        if (res.status) {
            if (addText.trim().length === 0) return ;
            let boards = Array.from(this.state.boards);
            boards[index][mapping.boardItems].push({[mapping.cardId] : res.id, [mapping.cardTitle] : addText});
            this.setState(boards)
        }

    }
    /**
     *
     * @returns {boolean} from callback
     */
    async removeBoardItem (obj){
        const {api, mapping} = this.props;
        const {parentIndex, index} = obj;

        const removeStatus = await api.removeCard(obj) ;

        if (removeStatus) {
            let boards = Array.from(this.state.boards);
            boards[parentIndex][mapping.boardItems].splice(index, 1)
            this.setState(boards)  
        }
  
    }

    /**
     *
     * @returns {boolean} from callback
     */
    async updateBoardItem (obj){
        const {api, mapping} = this.props;

        const {newTitle, parentIndex, index} = obj;
        const editStatus = await api.editCard(obj);

        if (editStatus) {
            let boards = Array.from(this.state.boards);
            boards[parentIndex][mapping.boardItems][index][mapping.cardTitle] = newTitle
            this.setState(boards) 
        }
    }
    // a little function to help us with reordering the result
    reorderCard = async (list, startIndex, endIndex,boardDestination,BaseResult) => { 
        const {api} = this.props;
        const {boards} = this.state;
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        
        const obj ={
            card : {
                ...removed,
                _order : endIndex
            },
            board : {
                ...boards[boardDestination]
            }
        }
        const reOrderStatus =  await api.reorderCard(obj);

        if (reOrderStatus) {
            result.splice(endIndex, 0, removed);
            return result;
        }


        return BaseResult

    };
    // a little function to help us with reordering the result
    reorderBoard = (list, startIndex, endIndex) => { 
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);

        result.splice(endIndex, 0, removed);
        return result;
      
    };

    /**
     * Moves an item from one list to another list.
     */
    moveCard = async(source, destination, droppableSource, droppableDestination, boardSource, boardDestination,BaseResult) => {
        
        const {api} = this.props;
        const {boards} = this.state;
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        const obj ={
            card : {
                ...removed,
                _order : droppableDestination.index
            },
            board : {
                ...boards[boardDestination]
            }
        }

        const moveStats = await api.moveCard(obj);

        if (moveStats) {
            destClone.splice(droppableDestination.index, 0, removed);
            const result = {};
            result[droppableSource.droppableId] = sourceClone;
            result[droppableDestination.droppableId] = destClone;
    
            return result;
        }
        return BaseResult
        
    };



    onDragEnd = async BaseResult => {
        const { source, destination } = BaseResult;
        const {change, mapping} = this.props;

        if (!destination) {
            return;
        }

        //Moving Boards
        if (BaseResult.type === "droppableItem") {
            const boards =  this.reorderBoard(
                this.state.boards,
                source.index,
                destination.index,
            );

            this.setState({boards});
            change(boards)
        }
        //Moving Board Items
        else if (BaseResult.type === "droppableSubItem") {
            //Reorder
            if (source.droppableId === destination.droppableId) {
                const sourceId  = source.droppableId[source.droppableId.length - 1];
                const result = await this.reorderCard(
                    this.state.boards[sourceId][mapping.boardItems],
                    source.index,
                    destination.index,
                    sourceId,
                    BaseResult
                );
    
                this.setState(prevState => {
                    prevState.boards[sourceId][mapping.boardItems] = result;
                    change(prevState.boards)
                    return {boards : prevState.boards}
                });
               
            }
            //Move 
            else {
                 
                const sourceId  = source.droppableId[source.droppableId.length - 1];
                const desId  = destination.droppableId[destination.droppableId.length - 1];

                const result = await this.moveCard(
                    this.state.boards[sourceId][mapping.boardItems],
                    this.state.boards[desId][mapping.boardItems],
                    source,
                    destination,
                    sourceId,
                    desId,
                    BaseResult
                );
    
                this.setState(prevState => {
                    prevState.boards[sourceId][mapping.boardItems] = result[`droppable${sourceId}`];
                    prevState.boards[desId][mapping.boardItems] = result[`droppable${desId}`];
                    change(prevState.boards)
                    return {boards : prevState.boards}
                });
    
            }
        }

        
    }

    getListStyle =  (isDragging, draggableStyle) => {
        const {width, height} = this.props
        return {
            width,
            height,
            userSelect: 'none',
            ...draggableStyle,
        }
    };


    render() {
        const {rtl, height, mapping} = this.props;
        const {boards} = this.state;
        
        const rtlClass = rtl ? 'r-rtl' : '';
        const contextValue = {
            rtl,
            mapping,
            addBoardItem : this.addBoardItem.bind(this),
            updateBoardItem : this.updateBoardItem.bind(this),
            removeBoardItem : this.removeBoardItem.bind(this),
        }

        
        return (
            <KanbanContext.Provider value={contextValue}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable direction={'horizontal'} droppableId="droppable" type="droppableItem">
                        {(provided, snapshot) => (
                            <div  className={`r-kanban ${rtlClass}`}
                            ref={provided.innerRef}
                            style={this.getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    boards.map((o, i) =>{
                                        return (
                                            <Board 
                                                height={height}
                                                rtl={rtl}
                                                id={o.id}
                                                items={o[mapping.boardItems]}
                                                title={o[mapping.boardTitle]} 
                                                subtitle={o.subtitle}
                                                data={o}
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