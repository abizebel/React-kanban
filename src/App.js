import React from 'react';
import logo from './logo.svg';
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
  {
    title : 'افزایش فروش پوینتر 3',
    subtitle : 'جذب 10 نماینده از مشاوران',
    items : [ ] 
  }
]



function App() {
  return (
    <Kanban
      width={'100%'}
      height={600}
      rtl={true}
      data = {data}
      change={(val)=>{
        console.log(val)
      }}
    />
  );
}

export default App;
