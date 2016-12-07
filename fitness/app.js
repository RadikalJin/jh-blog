var main = function() {

    $('.header').load("../nav.html");

    loadPosts();

    $('.dropdown-toggle').click(function(){
        $('.dropdown-menu').toggle();
    })
    $('.arrow-next').click(function(){
        var currentSlide = $('.active-slide');
        var nextSlide = currentSlide.next();
        if (nextSlide.length == 0) {
            nextSlide = $('.slide').first();
        }
        currentSlide.fadeOut(600).removeClass('active-slide');
        nextSlide.fadeIn(600).addClass('active-slide');

        var currentDot = $('.active-dot');
        var nextDot = currentDot.next();
        if (nextDot.length == 0) {
            nextDot = $('.dot').first();
        }
        currentDot.removeClass('active-dot');
        nextDot.addClass('active-dot');
    })
    $('.arrow-prev').click(function() {
        var currentSlide = $('.active-slide');
        var prevSlide = currentSlide.prev();
        if (prevSlide.length == 0) {
            prevSlide = $('.slide').last();
        }
        currentSlide.fadeOut(600).removeClass('active-slide');
        prevSlide.fadeIn(600).addClass('active-slide');

        var currentDot = $('.active-dot');
        var prevDot = currentDot.prev();
        if (prevDot.length == 0) {
            prevDot = $('.dot').last();
        }
        currentDot.removeClass('active-dot');
        prevDot.addClass('active-dot');
    })
}

$(document).ready(main);

function loadPosts() {
    d3.json("http://josephhoare.com:8090/posts", function(err, res) {
        if (err) alert("Unable to load post data.")
        else renderPosts(res)
    })
}

function renderPosts(data) {

    var posts = data.map(function(d) {
        var dateRaw = new Date(d.dueDate)
        var year = dateRaw.getFullYear()
        var month = dateRaw.getMonth()
        var date = dateRaw.getDate()
        d.formattedDate = m_names[month] + ' ' + date + ', ' + year;
        return d;
    })



    var anchor = d3.select("#post-data")
        .html("<img src=\"" + "http://gymbox.com/assets/images/blog/OlympicLift2-Web.jpg" + "\" style=\"width:100%\">")
        .appendHTML(getTitleSection(posts[0]))
        .appendHTML(getContentWrapper(posts[0]))
        .appendHTML(getEndingSection())
}

var m_names = new Array("January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December");

function getTitleSection(post) {
    return "<div class=\"jh-container jh-padding-8\">" +
                "<h2><b>" + post.title + "</b></h2>" +
                "<h5>Joe, <span class=\"jh-opacity\">" + post.formattedDate + "</span></h5>" +
            "</div>"
}

function getContentWrapper(post) {
    return "<div class=\"jh-container\"><br>" + post.description + "</div>";
}

function getEndingSection() {
    return "<div class=\"jh-row\">" +
                "<div class=\"jh-col m8 s12\">" +
                    "<p><button class=\"jh-btn jh-padding-large jh-white jh-border jh-hover-border-black\"><b>READ MORE <C2><BB></b></button></p>" +
                "</div>" +
                "<div class=\"jh-col m4 jh-hide-small\">" +
                    "<p><span class=\"jh-padding-large jh-right\"><b>Comments <C2><A0></b> <span class=\"jh-tag\">" + 0 + "</span></span></p>" +
                "</div>" +
            "</div>"
}

d3.selection.prototype.appendHTML =
    d3.selection.enter.prototype.appendHTML = function(HTMLString) {
        return this.select(function() {
            return this.appendChild(document.importNode(new DOMParser().parseFromString(HTMLString, 'text/html').body.childNodes[0], true));
        });
    };