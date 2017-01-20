 // Browser globals
this.ContextMenu = (function($) {
  'use strict';

    /* private vars
     ***********************/
    var
        // Flags
        flags = {
          flag1: true
        };

        // constructor
    function ContextMenu(options) {

      var self = this;

      this.contextMenuObj = null;

      this.menuObj = options.menu || null;

      this.targetElement = null;

      _initialize.call(this);

      _setEvents.call(this);

    }

    ContextMenu.prototype.openContextMenu = function(evt) { // element : element sobre el que s'obre el context menu

      var pos = Utils.getAbsoluteMousePosition(evt);

      this.contextMenuObj.css({left: (pos.x - 3) + 'px', top: (pos.y - 3) + 'px'});

      this.contextMenuObj.show();

      this.targetElement = $(evt.target);

    };

    ContextMenu.prototype.closeContextMenu = function() {

      this.contextMenuObj.hide();

      this.targetElement = null;

    };


    ContextMenu.prototype.enableItem = function(id) {
       _setDisableItem.call(this, false, id);
    };

    ContextMenu.prototype.disableItem = function(id) {
       _setDisableItem.call(this, true, id);
    };


    ContextMenu.prototype.destroyContextMenu = function() {
      // s'ha d'evitar les memory leaks i fer tota la pesca de desreferenciar l'objecte
    };

    ContextMenu.prototype.attachContextMenuToElement = function(element) {

       var self = this;

       $(element).on('mousedown', function(evt) { // per obrir el contextmenu

          evt.preventDefault();

          if(evt.target == this) { // el target ha de ser el propi element
            if(evt.which == 3) { // which es la tecla que ha premut, 3 es boto dret ratoli
              self.openContextMenu(evt);
            }
          }
       });

    };


    return ContextMenu;

    /* private fucntions
     *************************/

    function _initialize() {

      _createDomContextMenu.call(this);

      this.contextMenuObj.appendTo('body');

    }

    function _createDomContextMenu() {

      this.contextMenuObj = $('<div class="context-menu" data-id="' + this.menuObj.id + '"><ul></ul></div>');

      var list = this.contextMenuObj.find('ul'),
          item = null,
          current = null;

      for( var i in this.menuObj.items) {

        current = this.menuObj.items[i];

        if(i == 'delimiter') {
          item = $('<li class="delimiter"> </li>');
        } else {

          var disabled = current.active ? ' data-disabled="false" ' : ' data-disabled="true" ';

          item = $('<li id="' + current.id + '" class="item" ' + disabled + '>' + current.label + '</li>');
        }

        list.append(item);

        _setEvent.call(this, current.eventType, item, current.callback);
      }

    }

    function _setEvent(eventType, item, callback) {

      var self = this;

      var eventType = eventType || 'click';
      item.on(eventType, function(evt) {

        //if(this.dataset.disabled == "true") { // dataset no es compatible amb tots
        if($(this).attr("data-disabled") == true) {
          return;
        }

        callback(this, evt, self.targetElement);
      });

    }

    function _setEvents() {
      this.contextMenuObj.on('mouseleave', function(evt) {
        $(this).hide();
      });
    }

    function _setDisableItem(state, id) {
      this.contextMenuObj.find('#' + id).attr('data-disabled', state);
    }


})(jQuery);


var menuObj1 = {
   id: 'em meu menu',
   items: {
     /* 'save': {
       label: 'save',
       id: 'save',
       callback: function(item, evt) {
         // codi aqui
         alert('save');
       },
       eventType: 'click', // estat de l'item del submenu
       active: true // estat de l'item del submenu
     }, */
     'copy': {
       label: 'copy',
       id: 'copy',
       callback: function(item, evt, target) {
          // codi aqui
         var index = $(target).index();

         RBox.copy();
       },
       eventType: 'click', // estat de l'item del submenu
       active: true // estat de l'item del submenu
     },
     'delimiter': true,
     'paste': {
       label: 'paste',
       id: 'paste',
       callback: function(item, evt, target) {
         // codi aqui
         var index = $(target).index() + 1;

         RBox.paste(index);

       },
       eventType: 'click',
       active: false // estat de l'item del submenu
     }
   }
};

 var context1 = null;

 jQuery(document).ready(function() {


   context1 = new ContextMenu({menu: menuObj1});

   /* jQuery('#container').on('mousedown', function(evt) { // per obrir el contextmenu

      if(evt.target == this) {
        if(evt.which == 3) { // which es la tecla que ha premut
          //alert("Right mouse button clicked on element with id myId");
          context1.openContextMenu(evt);

        }
      }
   }); */

   //context1.attachContextMenuToElement('#container');

   context1.attachContextMenuToElement('.quaver');

 });


