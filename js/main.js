$(document).ready(() => {

    $('.flag-button').on('click', event => {
        $wrapper = $(event.currentTarget).parent().parent();
        $desc = $wrapper.siblings('.desc');
        $desc.toggleClass('hide');
    });
});
