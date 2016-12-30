function checkImage(url, element) {
    imageCallback(url,
        function() {},
        function() {
            element.attr('src', 'https://b2.burst.zone/wp-content/uploads/2013/07/no-image-found.jpg');
        }
    );
};
function imageCallback(url, load, error) {
    var image = new Image();
    image.onload = load;
    image.onerror = error;
    image.src = url;
};