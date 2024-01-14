var Player_Ui_Creator = {
    
    UIElement: {

        appendHTML: function (targetElementSelector, htmlContent) {

            
            $(targetElementSelector).append(htmlContent);                           
            

        },
        emptyHTML: function (targetElementSelector) {

           $(targetElementSelector).children().not('.protected').remove();

        }

    }

}