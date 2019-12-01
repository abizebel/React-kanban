class RButton{
    constructor(props){
        this.props = props;
    }
    close(){
       this.render({opened:false});
    }
    open(){
      this.render({opened:true});
    }
    getClassName(className){
        var {text = '',disabled = false} = this.props;
        return `r-button${disabled?' disabled':''}${text === ''?' r-button-icon':''}${className?' ' + className:''}`;
    }
    getValue(value){
        if(typeof value === 'function'){return value(this.props);}
        return value;
    }
    jsToCss(obj){
        let str = "";
        for (let prop in obj) {
            str += prop.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) + ": " + obj[prop] + ";";
        }
        return str;
    }
    click(e){
      if(!$(e.target).hasClass('r-button') && !$(e.target).hasClass('main-icon')){return;}
      var {items,callback = function(){},type = 'list'} = this.props;
      if(type === 'filter' || type === 'sort'){
        this.open();
      }
      else{
        if(items&&items.length > 0){this.open();}
        else{callback(this.props);}
      }
    }
    itemMouseDown(e){
      var index = $(e.currentTarget).attr('data-index');
      var {items} = this.props;
      var item = items[index];
      if(item.href){return;}
      var {callback} = this.props;
      if(item.disabled){return;}
      if(item.callback){item.callback(item,this.props);}
      else if(callback){callback(item,this.props);} 
      if(item.close !== false){this.close();}
    }
    setProps(obj){for(var prop in obj){this.props[prop] = obj[prop]}}
    updatePopupPosition(){
      var {rtl} = this.props;
      var popup = this.dom.find('.r-button-popup');
      if(popup.length === 0){return;}
      var popupWidth = popup.width();
      var bodyWidth = window.innerWidth;
      var popupLeft = popup.offset().left;
      var popupRight = popupLeft + popupWidth;
      if(rtl && popupLeft < 0){
        popup.css('right',popupLeft - 2);
      }
      else if(!rtl && popupRight > bodyWidth){
        popup.css('left', bodyWidth - popupRight - 2);
      }
    }
    setEvents(){
      var dom = this.dom;
      var backDrop = dom.find('.back-drop');
      var listItem = dom.find('.list-item');
      dom.unbind('click',this.click).bind('click',$.proxy(this.click,this));
      backDrop.unbind('click',this.close).bind('click',$.proxy(this.close,this));
      listItem.unbind('click',this.itemMouseDown).bind('click',$.proxy(this.itemMouseDown,this));
    }
    render(obj = {}){
      this.setProps(obj)
      var {opened,container,disabled,iconClass,style,items = [],type = 'list',text = '',rtl=false,className,opened} = this.props;
      var contextValue = this.props;
      contextValue.close = this.close.bind(this);
      contextValue.getValue = this.getValue.bind(this);
      contextValue.jsToCss = this.jsToCss;
      this.context = contextValue;
      var props = {
          className:this.getClassName(this.getValue(className)),
          style:$.extend({},{
            direction:rtl?'rtl':'ltr',
          },this.getValue(style)),
          disabled
      }
      var str = '';
      str += `
          <button class="${props.className}" style="${this.jsToCss(props.style)}">
          ${iconClass?`<div class="icon main-icon ${this.getValue(iconClass)}"></div>`:''}
            ${text}
            ${type === 'list' && opened && items.length > 0 ? new Popup({context:this.context}).render():''}
          </button>
      `;
      var dom = $(str);
      var Container = typeof container === 'object'?container:$(container);
      if(this.dom){
        this.dom.replaceWith(dom);
        this.dom = dom;
      }
      else{
        this.dom = dom;
        Container.append(dom);
      }
      this.updatePopupPosition();
      this.setEvents();
    }
}
class Popup{
    constructor(props){
      this.props = props;
    }
    getStyle(style){
      var {rtl,jsToCss} = this.props.context;
      return jsToCss($.extend({},{
        position: 'absolute',
        zIndex:1000,
        top:'100%',
        direction:rtl?'rtl':'ltr',
        [rtl?'right':'left']:0,
      },style));
    }
    getBackDropStyle(){
      return this.props.context.jsToCss({
        height:'100%',width:'100%',right:0,top:0,position:'fixed',zIndex:1
      })
    }
    render(){
        var {close,popupStyle = {},getValue} = this.props.context;
        var str = '';
        str += `
        <div class="r-button-popup" style="${this.getStyle(getValue(popupStyle))}">
            <div class='back-drop' style="${this.getBackDropStyle()}"></div> 
            ${new ForDrop({context:this.props.context}).render()}
        </div>
        `;
        return str;
    }
  }


  class ForDrop{
    constructor(props){
      this.props = props;
    }
    add(){
      var {items,onchange,operators,targets,value,type} = this.props.context;
      var obj = {[operators.field]:operators.default,[targets.field]:targets.default};
      if(type === 'filter'){obj[value.field] = '';}
      items.push(obj);
      onchange(items,this.props.context);
    }
    getAddStyle(){
        var {rtl} = this.props.context;
        return {  
            margin:'0 27px',
            padding:'0 12px',
            color:'#fff',
            background:'blue',
            //borderRadius:'inherit',
            fontSize:'12px',
            float:rtl?'right':'left',
            height:'24px',
            lineHeight:'24px',
            cursor:'pointer'
        }
    }
    render(){
      var {items,type,addText} = this.props.context;
      var selective = type === 'filter' || type === 'sort';
      const Items = items.map((item, i)=>{
        var props = {item,index:i,context:this.props.context};
        if(selective){return new SelectiveItem(props);}
        else{return new ListItem(props).render() + '<br/>';}
      })
        var str = '';
        str += `
        <div class="for-drop" style="z-index:10">
            ${Items.join('')}
            ${selective?'<div style="'+this.getAddStyle()+'">' + addText + '</div>':''}
        </div>
       `;
       return str; 
    }
  }

  class ListItem{
    constructor(props){
        this.props = props;
    }
    
    getStyle(){
        var {disabled,rtl,jsToCss} = this.props.context;
        return jsToCss({
          cursor:disabled?'not-allowed':'pointer', 
          textAlign:rtl?'right':'left',
          float:'left'
        })
    }
    render(){
        var {item,index} = this.props;
        var {checkIconClass,checkable} = this.props.context;
        var {iconClass,disabled} = item;
        var Item = `
            ${item.href?'<a':'<div'}
                class="${'list-item' + (disabled?' disabled':'')}" 
                style="${this.getStyle()}"
                data-index="${index}"
                ${item.href?`href="${item.href}"`:''}
            >
            ${checkable?`<div class="icon ${checkIconClass}" style="opacity:${item.checked?1:0};"></div>`:''}
            ${item.iconClass?`<div class="icon ${iconClass}"></div>`:''}
            ${item.text}
            ${item.href?'</a>':'</div>'}
        `;
        var str = '';
        str += `
            ${item.splitter?'<div class="splitter">'+item.splitter+'</div>':''}
            ${Item}
        `;
        return str;
        
        
    }
}






