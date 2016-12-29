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

function getSendToURLByAction(action) {
    var extension;
    switch(action) {
        case 'create':
            extension = 'createPost';
            break;
        case 'update':
            extension = 'updatePost';
            break;
        case 'delete':
            extension = 'deletePost';
            break;
        default :
            return undefined;
    }
    return 'http://josephhoare.com:8090/' + extension;
}

function getPastVerbByAction(action) {
    switch(action) {
        case 'create': return 'created';
        case 'update': return 'updated';
        case 'delete': return 'deleted';
        default : return undefined;
    }
}