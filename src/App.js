import React from 'react';
import './App.css';
import Kanban from './components/Kanban/Kanban'

const data = [
  {
    title : 'افزایش فروش پوینتر 1',
    subtitle : 'جذب 10 نماینده از مشاوران',
    items : [
      {title : 'برگزاری رویداد معرفی محصول 1'},
      {title : 'برگزاری رویداد معرفی محصول 2'},
      {title : 'برگزاری رویداد معرفی محصول 3'},
      {title : 'برگزاری رویداد معرفی محصول 4'},
      {title : 'برگزاری رویداد معرفی محصول 5'},
    ] 
  },
  {
    title : 'افزایش فروش پوینتر 2',
    subtitle : 'جذب 10 نماینده از مشاوران',
    items : [
      {title : 'برگزاری رویداد معرفی محصول 6'},
      {title : 'برگزاری رویداد معرفی محصول 7'},
      {title : 'برگزاری رویداد معرفی محصول 8'},
      {title : 'برگزاری رویداد معرفی محصول 9'},
    ] 
  },
  {
    title : 'افزایش فروش پوینتر 3',
    subtitle : 'جذب 10 نماینده از مشاوران',
    items : [ ] 
  },

]



function App() {
  return (
    <Kanban
      mapping = {{
        boardTitle :  'title',
        boardItems :'items',
        cardTitle :  'title',
        cardId : 'id'
    }}
      width={'100%'}
      height={600}
      rtl={true}
      data = {data}
      change={(val)=>{
        console.log(val)
      }}
      api ={{
        add : (data) => {
          return {
            status : true,
            id : 5
          }
        },
        remove : (data) => {
          return true
        },
        edit : (data) => {
          return true
        },
        move : (data) => {
          return true
        }
      }}
    />
  );
}

export default App;
