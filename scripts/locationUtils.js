function getReturnToURLByBlogId(blogId) {
    return "http://josephhoare.com/" + getURLByBlogId(blogId);
}

function getURLByBlogId(blogId) {
    var result = '';
    switch(blogId) {
        case '1':
            result = 'fitness';
            break;
        default:
            result = undefined;
    }
    return result;
}

function getSendToURLByPost(post) {
    var extension;
    if (post.id) {
        extension = 'updatePost';
    } else {
        extension = 'createPost';
    }
    return 'http://josephhoare.com:8090/' + extension;
}