function addFormattedDateToPosts(data) {
    var m_names = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");
    for (var i = 0; i < data.length; i++) {
        var currentPost = data[i];
        var date = new Date(+parseInt(currentPost.createdDate, 10));
        currentPost.formattedDate = m_names[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }
    return data;
}