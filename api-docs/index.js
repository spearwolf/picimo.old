'use strict';

const attachFastClick = require('fastclick');
attachFastClick(document.body);

$('.menu-icon').click(function () {
    $('.sidebar,body').toggleClass('overlay');
    $('.sidebar.overlay .sidebar__content').scrollTop(0);
});

$('.toc-sidebar a').click(function () {
    $('.sidebar.overlay,body.overlay').removeClass('overlay');
    return true;
});

