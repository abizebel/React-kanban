






    $(document).ready(function(){

        $('.r-button.jq').click(function(e){
            $(e.target).closest('.r-button.jq').find('.r-button-popup').toggle()
        })
        

    //Loading

    setTimeout(function(){
        $('.preLoader').hide()
    },2000)
    //Popup
    $('.rf-popup-close').click(function(e){
        if ($(e.target).closest('.rf-popup').hasClass('open')) {
            $(e.target).closest('.rf-popup').removeClass('open')
            $('.rf-backdrop').remove();
        }
    })


        //Input
        $(".rf-input > input").each(function(i, el){
            if($(el).val().length) {
                $(el).closest('.rf-input').addClass('filled')
            } 
            else {
                $(el).closest('.rf-input').removeClass('filled')
            }
        })
        $(".rf-input > input").change(function(){
            if($(this).val().length) {
                $(this).closest('.rf-input').addClass('filled')
            }  
            else {
                $(this).closest('.rf-input').removeClass('filled')
            }
        });
        $(".rf-input > textarea").each(function(i, el){
            if($(el).val().length) {
                $(el).closest('.rf-input').addClass('filled')
            } 
            else {
                $(el).closest('.rf-input').removeClass('filled')
            }
        })
        $(".rf-input > textarea").change(function(){
            if($(this).val().length) {
                $(this).closest('.rf-input').addClass('filled')
            }  
            else {
                $(this).closest('.rf-input').removeClass('filled')
            }
        });
        //Select
    
        $(document).click(function(e){
            if ($(e.target).closest('.rf-select').length == 0) {
                $('.rf-select').removeClass('active')
            }
    
        })
        $('.rf-select').click(function(e){
            if(!$(this).hasClass('active')) {
                $('.rf-select').removeClass('active')
                $(this).addClass('active')
            }
            else {
                if ($(e.target).closest('.rf-options').length == 0) {
                    $(this).removeClass('active')
                }
                
            }
    
        })
    
    
        //Autocomplete
        $(document).click(function(e){
            if ($(e.target).closest('.rf-autocomplete').length == 0) {
                $('.rf-autocomplete').removeClass('active')
            }
    
        })
        $('.rf-autocomplete > input').keyup(function(e){
            if(!$(e.target).closest('.rf-autocomplete').hasClass('active')) {
                $('.rf-autocomplete').removeClass('active')
                $(e.target).closest('.rf-autocomplete').addClass('active')
            }
            else {
                if ($(e.target).closest('.rf-options').length == 0) {
                    $(e.target).closest('.rf-autocomplete').removeClass('active')
                }
                
            }
    
        })
        //Tag       
        function removeTag (tagDom, index){
            tagDom.find('.rf-tag-list .rf-tag-list-item').eq(index).remove()
        }

        function addTag (tagDom, txt,name, index){
            tagDom.find('.rf-tag-list').append(`
                <li class="rf-tag-list-item"><input style="display:none" name="${name}" type="text" checked/>${txt}<span class="rf-tag-icon"><span class="mdi mdi-close"></span></span></li>
            `) ;

            setTimeout(function(){
                $(".rf-tag-icon").click(function(e){
                    removeTag($(e.target).closest('.rf-tag'), $(this).closest('.rf-tag-list-item').index())
                })
            },100)
        }

        $(".rf-tag-icon").click(function(e){
            removeTag($(e.target).closest('.rf-tag'), $(this).closest('.rf-tag-list-item').index())
        })
    
        $(".rf-tag > input").each(function(i, el){
            if($(el).val().length) {
                $(el).closest('.rf-tag').addClass('filled')
            } 
            else {
                $(el).closest('.rf-tag').removeClass('filled')
            }
        })
        $(".rf-tag > input").change(function(){
            if($(this).val().length) {
                $(this).closest('.rf-tag').addClass('filled')
            } 
            else {
                $(this).closest('.rf-tag').removeClass('filled')
            }
        });
        $(".rf-tag > ul").each(function(i, el){
            if($(el).find('li').length) {
                $(el).closest('.rf-tag').addClass('filled')
            } 
    
        })
        $(document).click(function(e){
            if ($(e.target).closest('.rf-tag').length == 0) {
                $('.rf-tag').removeClass('active')
            }
    
        });
    
        function searchTag (list, text){
            if (text.length ==0) {
                list.find('.rf-options-item').each(function(i, o){
                    $(o).removeClass('hide');
                });
                return false
            }
            
            list.find('.rf-options-item').each(function(i, o){
                $(o).removeClass('hide');

                if ($(o).attr('data-value').trim().indexOf(text) == -1) {
                    $(o).addClass('hide')
                }
            })
            return true
    
        }


        


        $('.rf-options-item').click((e) =>{
            var flag = false;
            var selectedValue = $(e.target).closest('.rf-options-item').attr('data-value');
            var selectedName = $(e.target).closest('.rf-options-item').attr('data-name');
            var list =  $(e.target).closest('.rf-tag').find('.rf-tag-list-item');
            list.each((i , o) =>{
                if ($(o).text() == selectedValue) {
                    flag = true
                }
            })
            if (flag) return ;

            addTag($(e.target).closest('.rf-tag'), selectedValue,selectedName,list.length)
            $(e.target).closest('.rf-tag').removeClass('active')
        })

        $('.rf-tag > input').keyup(function(e){
            var val = e.target.value ;
            var res = searchTag($(e.target).closest('.rf-tag').find('.rf-options'), val)   
            if(res) {
                $('.rf-tag').removeClass('active')
                $(e.target).closest('.rf-tag').addClass('active')
            }
        })
        $('.rf-tag > input').click(function(e){
            $('.rf-tag').removeClass('active')
            $(e.target).closest('.rf-tag').addClass('active')
        })
    });