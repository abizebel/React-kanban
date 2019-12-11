class Navbar{
    constructor(props){
        this.props = props;
    }
    render(){
        var {items,size,container,rtl,title} = this.props;
        var str = '';
        str += `
            <div class="navbar" style="width:100%;float:left;box-sizing:border-box;padding:6px;text-align:center;">
                ${title?'<div class="page-title" style="display:inline-block;">'+title+'</div>':''}
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
            item.style={color:'inherit',float:left?'left':'right',margin:0};
            var button = new RButton(item);
            this.items.push(button)
            button.render();
        }
    }
}