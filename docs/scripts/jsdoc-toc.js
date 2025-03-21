(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"global.html\">Globals</a>","id":"global","children":[]},{"label":"<a href=\"AuthController.html\">AuthController</a>","id":"AuthController","children":[]},{"label":"<a href=\"AuthRepository.html\">AuthRepository</a>","id":"AuthRepository","children":[]},{"label":"<a href=\"AuthService.html\">AuthService</a>","id":"AuthService","children":[]},{"label":"<a href=\"Ticket.html\">Ticket</a>","id":"Ticket","children":[]},{"label":"<a href=\"TicketController.html\">TicketController</a>","id":"TicketController","children":[]},{"label":"<a href=\"TicketRepository.html\">TicketRepository</a>","id":"TicketRepository","children":[]},{"label":"<a href=\"TicketService.html\">TicketService</a>","id":"TicketService","children":[]},{"label":"<a href=\"User.html\">User</a>","id":"User","children":[]},{"label":"<a href=\"UserController.html\">UserController</a>","id":"UserController","children":[]},{"label":"<a href=\"UserRepository.html\">UserRepository</a>","id":"UserRepository","children":[]},{"label":"<a href=\"UserService.html\">UserService</a>","id":"UserService","children":[]},{"label":"<a href=\"module-Dependencies.html\">Dependencies</a>","id":"module:Dependencies","children":[]},{"label":"<a href=\"module-app.html\">app</a>","id":"module:app","children":[]},{"label":"<a href=\"module-controllers.html\">controllers</a>","id":"module:controllers","children":[]},{"label":"<a href=\"module-middleware.html\">middleware</a>","id":"module:middleware","children":[]},{"label":"<a href=\"module-%257BObject%257D.html\">{Object}</a>","id":"module:{Object}","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: false,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
