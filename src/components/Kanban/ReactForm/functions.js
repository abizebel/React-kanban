import React from 'react';


export function createUID (){
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
     };
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export function createIcon (icon){
    if(icon === null) return ;
    if (icon.type === 'svg'){
        return icon;
    }
    else {
        return <span className={icon}></span>
    }
}

export function getValueByProp(arr, field) {
    let obj =!Array.isArray(arr) || arr.length === 0 ? arr: arr[0] ;
    if (Array.isArray(field)) { field = field[obj.level]; }
    field = field.split('.');
    var value = obj[field[0]];
    for (var i = 1; i < field.length; i++) {
      if (!value) { return '' }
      value = value[field[i]];
    }
    return value;
}


export function getValueById (arr, id, mappingName){
    return arr.filter(item => String(item[mappingName]) === String(id))[0]
}
