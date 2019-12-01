class Toolbar{
    constructor(props){
        this.props = props;
    }
    render(){
        var {items,size,container,rtl} = this.props;
        var str = '';
        str += `
            <div class="toolbar" style="border-bottom:1px solid #eee;width:100%;float:left;box-sizing:border-box;padding:6px;text-align:center;">
            </div>
        `;
        var dom = $(str);
        var Container = typeof container === 'object'?container:$(container);
        if(this.dom){
            this.dom.replaceWith(dom);
            this.dom = dom;
        }
        else{
            Container.append(dom);
            this.dom = dom;
        }
        this.items = [];
        for(var i = 0; i < items.length; i++){
            var item = items[i];
            item.className = size;
            item.container = this.dom;
            item.rtl = rtl;
            var left = item.float === 'right'?false:true;
            left = rtl?!left:left;
            item.style={color:'inherit',float:left?'left':'right',margin:0,padding:'6px 0',['padding'+(rtl?'Left':'Right')]:'16px',fontSize:'12px'};
            var button = new RButton(item);
            this.items.push(button)
            button.render();
        }
    }
}