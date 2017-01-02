window.addEventListener("load", updateRenderers, false);

function updateRenderers() {
    if (!$('.header').find('.navTitle').length) {
        //$('.header').load("/jh-blog-ui/nav/nav.html");
        $('.header').load("/nav/nav.html");
    }

    var signedInUser = JSON.parse(sessionStorage.getItem('user'));
    if (signedInUser) {
        $('#signin-link').text(signedInUser.name)
    } else {
        $('#signin-link').text("UUUUU")
    }
}

function onClickSignIn() {
    var user = {'name':'Test Username'};
    sessionStorage.setItem('user', JSON.stringify(user));
    updateRenderers()
}

function onClickNewPost() {
    sessionStorage.removeItem('postToEdit');
    window.location = "../editor";
    /*TODO REVERT TO REFER BY ROOT*/
}