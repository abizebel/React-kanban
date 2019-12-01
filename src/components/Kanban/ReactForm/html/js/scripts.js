$(document).ready(function(){


    //Input
    $(".r-input > input").each(function(i, el){
        if($(el).val().length) {
            $(el).closest('.r-input').addClass('filled')
        } 
        else {
            $(el).closest('.r-input').removeClass('filled')
        }
    })
    $(".r-input > input").change(function(){
        if($(this).val().length) {
            $(this).closest('.r-input').addClass('filled')
        }  
        else {
            $(this).closest('.r-input').removeClass('filled')
        }
    });
    $(".r-input > textarea").each(function(i, el){
        if($(el).val().length) {
            $(el).closest('.r-input').addClass('filled')
        } 
        else {
            $(el).closest('.r-input').removeClass('filled')
        }
    })
    $(".r-input > textarea").change(function(){
        if($(this).val().length) {
            $(this).closest('.r-input').addClass('filled')
        }  
        else {
            $(this).closest('.r-input').removeClass('filled')
        }
    });
    //Select

    $(document).click(function(e){
        if ($(e.target).closest('.r-select').length == 0) {
            $('.r-select').removeClass('active')
        }

    })
    $('.r-select').click(function(e){
        if(!$(this).hasClass('active')) {
            $('.r-select').removeClass('active')
            $(this).addClass('active')
        }
        else {
            if ($(e.target).closest('.r-options').length == 0) {
                $(this).removeClass('active')
            }
            
        }

    })


    //Autocomplete
    $(document).click(function(e){
        if ($(e.target).closest('.r-autocomplete').length == 0) {
            $('.r-autocomplete').removeClass('active')
        }

    })
    $('.r-autocomplete > input').keyup(function(e){
        if(!$(e.target).closest('.r-autocomplete').hasClass('active')) {
            $('.r-autocomplete').removeClass('active')
            $(e.target).closest('.r-autocomplete').addClass('active')
        }
        else {
            if ($(e.target).closest('.r-options').length == 0) {
                $(e.target).closest('.r-autocomplete').removeClass('active')
            }
            
        }

    })
    //Tag
    $(".r-tag > input").each(function(i, el){

        if($(el).val().length) {
            $(el).closest('.r-tag').addClass('filled')
        } 
        else {
            $(el).closest('.r-tag').removeClass('filled')
        }
    })
    $(".r-tag > input").change(function(){
        if($(this).val().length) {
            $(this).closest('.r-tag').addClass('filled')
        } 
        else {
            $(this).closest('.r-tag').removeClass('filled')
        }
    });
    $(".r-tag > ul").each(function(i, el){
        if($(el).find('li').length) {
            $(el).closest('.r-tag').addClass('filled')
        } 

    })
    $(document).click(function(e){
        if ($(e.target).closest('.r-tag').length == 0) {
            $('.r-tag').removeClass('active')
        }

    })
    $('.r-tag > input').keyup(function(e){
        if(!$(e.target).closest('.r-tag').hasClass('active')) {
            $('.r-tag').removeClass('active')
            $(e.target).closest('.r-tag').addClass('active')
        }
        else {
            if ($(e.target).closest('.r-options').length == 0) {
                $(e.target).closest('.r-tag').removeClass('active')
            }
            
        }

    })

});