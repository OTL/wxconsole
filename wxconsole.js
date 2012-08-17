/** Copyright 2012 OTL.
 *
 * @license BSD license
 *
 * @version 1.0.0
 * @author Takashi Ogura <t.ogura@gmail.com>
 *
 */

/**
 * @namespace Holds wxconsole objects.
 * @description wxconsole is rxconsole for rosbridge.
 */
var wxconsole = {};

/**
 * Convert rosgraph_msgs/Log level byte to String
 *
 * @param {Number} level level of Log
 * @returns {String} debug level Fatal/Error/Warn/Info/Debug/Unknown(for error)
 */
wxconsole.levelToString = function(level) {
  if (level >= 16) {
    return 'Fatal';
  } else if (level >= 8) {
    return 'Error';
  } else if (level >= 4) {
    return 'Warn';
  } else if (level >= 2) {
    return 'Info';
  } else if (level >= 1) {
    return 'Debug';
  }
  return 'Unknown';
}

/**
 * Returns Twitterbootstrap's icon class from Log level
 * @param {Number} level level of Log
 * @returns {String} Twitterbootstrap's icon class string
 */
wxconsole.levelToTBIcon = function(level) {
  var dict = {
    Unknown : 'icon-leaf',
    Debug : 'icon-pencil',
    Info : 'icon-info-sign',
    Warn : 'icon-exclamation-sign',
    Error : 'icon-remove-sign',
    Fatal : 'icon-remove'
  };

  return dict[wxconsole.levelToString(level)];
};


/**
 * Converts Log severity level to TwitterBootstrap label name
 * @param {Number} level level of Log
 * @returns {String} Twitterbootstrap's label class string
 */
wxconsole.levelToTBLabel = function(level) {
  var dict = {
    Unknown : '',
    Debug : '',
    Info : 'label-info',
    Warn : 'label-warning',
    Error : 'label-important',
    Fatal : 'label-inverse'
  };

  return dict[wxconsole.levelToString(level)];
};

/**
 * Generate HTML for modal from message
 * @param {rosgraph_msgs/Log} msg ros message
 * @returns {String} HTML
 */
wxconsole.messageToHTML = function(msg) {
  return '<p><strong>Node: </strong>' + msg.name + '</p>' +
    '<p><strong>Time: </strong>' + msg.header.stamp.secs + '.' +
    msg.header.stamp.nsecs + '</p>' +
    '<p><strong>Severity: </strong>' + wxconsole.levelToString(msg.level) + '</p>' +
    '<p class="break-word"><strong>Location: </strong>' + msg.file + ':in `' + msg.function + "\':" + msg.line + '</p>' +
    '<p class="break-word"><strong>Published Topics: </strong>' + msg.topics.join(', ') + '</p>' +
    '<p /><h3>' + msg.msg + '</h3>';
};

/**
 * create websocket uri from host and port
 * @param {String} host name of host
 * @param {String} port port number
 * @returns {String} uri of websocket ex) ws://localhost:9090
 */
wxconsole.MakeWebsocketUri = function(host, port) {
  return "ws://" + host + ":" + port.toString();
};

/**
 * generate string for location from a message
 * @param {rosgraph_msgs.Log} msg
 * @returns {String} file:in `func':line
 */
wxconsole.generateLocationString = function(msg) {
  return msg.file + ':in `' + msg.function + "':" + msg.line;;
};

/**
 * filter by user search form
 * @class filter by user search form
 * @param {String} name name of this filter (not used now)
 */
wxconsole.SearchFilter = function(name) {
  if (name) {
    this.name = name;
  } else {
    this.name = 'Search';
  }
  this.enabled = true;
  this.text = '';
  this.include = true;
  this.regex = false;
  this.where = {
    Message: true,
    Node: true,
    Location: true,
    Topics: true
  };

  var self = this;

  /**
   * judge by string
   * @param {String} targetText string for search
   * @returns {boolean} true: includes
   */
  this.stringInclude = function(targetText) {
    return (targetText.indexOf(self.text) >= 0);
  };

  /**
   * judge by RegExp
   * @param {String} targetText
   * @returns {boolean} true: includes
   */
  this.regexInclude = function(targetText) {
    var regex = new RegExp(self.text);
    return targetText.match(regex);
  };

  this.toggleEnabled = function() {
    self.enabled = !self.enabled;
  };

  this.toggleRegex = function() {
    self.regex = !self.regex;
  };

  this.toggleWhere = function(where) {
    self.where[where] = !self.where[where];
  };
};

wxconsole.SearchFilter.prototype = {
  /**
   * check a msg reject or not
   * @param {rosgraph_msgs.Log} msg message for checked
   * @returns {bool} true: reject this message
   */
  reject: function(msg) {
    if (!this.enabled) {
      return false;
    }
    if (this.text == ''){
      return false;
    }
    var compareFunc = null;
    if (this.regex) {
      compareFunc = this.regexInclude;
    } else {
      compareFunc = this.stringInclude;
    }
    var include = false;
    if (this.where['Message'] && compareFunc(msg.msg)) {
      include = true;
    } else if (this.where['Node'] && compareFunc(msg.name)){
      include = true;
    } else if (this.where['Location'] &&
               (compareFunc(wxconsole.generateLocationString(msg)))) {
      include = true;
    } else if (this.where['Topics'] &&
               compareFunc(msg.topics.toString())) {
      include = true;
    }
    if (this.include) {
      return !include;
    } else {
      return include;
    }
  }
};

/**
 * filter by severity level
 * @class filter by severity level
 */
wxconsole.SeverityFilter = function() {
  /**
   * @type {Hash} levels. true means reject this level.
   * @description default: not reject anything.
   */
  this.selectedLevel = {Unknown: false,
                        Debug: false,
                        Info: false,
                        Warn: false,
                        Error: false,
                        Fatal: false};
  /**
   * @type {String} name of this filter.
   * @description not used for now.
   */
  this.name = 'SeverityFilter';
};

wxconsole.SeverityFilter.prototype = {

  /**
   * judge a message
   * @param {rosgraph_msgs.Log} msg message for test
   * @returns {boolean} true: reject
   */
  reject: function(msg) {
    return this.selectedLevel[wxconsole.levelToString(msg.level)];
  },

  /**
   * toggle severity filter of a level
   * @param {String} levelText
   */
  toggleSelectedLevel: function(levelText){
    this.selectedLevel[levelText] = !this.selectedLevel[levelText];
  }
};


/**
 * @class View Controller for search filter
 * @param {Number} filterNumber
 * @param {wxconsole.SearchFilter} filter target filter
 * @param {wxconsole.MessageViewController} parent
 */
wxconsole.SearchFilterViewController = function(filterNumber, filter, parent) {

  /**
   * @type {wxconsole.SearchFilter}
   */
  this.filter = filter;

  /**
   * id number of this filter
   * @type {Number}
   */
  this.filterNumber = filterNumber;

  var self = this;

  /**
   * disable up button if it is top, disable down buton if it is bottom.
   */
  this.updateFilterButtons = function() {
    var firstForm = $('#filters form:first');
    var upButtonQuery = '.filter-up';
    var downButtonQuery = '.filter-down';
    // up
    firstForm.find(upButtonQuery).addClass('disabled');
    firstForm.next().find(upButtonQuery).removeClass('disabled');
    var lastForm = $('#filters form:last');
    // down
    lastForm.prev().find(downButtonQuery).removeClass('disabled');
    lastForm.find(downButtonQuery).addClass('disabled');
  };


  /**
   * update table
   */
  this.updateResults = function() {
    parent.updateAllMessageFilteringResult();
  };

  /**
   * initialize controller
   */
  this.init = function() {
    var thisForm = $('#filterForm' + self.filterNumber);
    // controller

    // incremental search (heavy..)
    thisForm.find('#filterText' + self.filterNumber).bind('textchange',
         function(event, previousText) {
           self.filter.text = $(this).val();
           self.updateResults();
         });

    thisForm.find('#filter_enabled' + self.filterNumber)
      .button('toggle')
      .click(
      function(ev) {
        if (ev.clientX == 0 && ev.clientY == 0) {
          // dummy event by form submit
          // this is bug?
          self.filter.text = thisForm.find('#filterText' + self.filterNumber).val();
          self.updateResults();
          return false;
        }
        self.filter.toggleEnabled();
        $(this).button('toggle');
        self.updateResults();
        return false;
      });

    thisForm.find('#filterRegExCheck' + self.filterNumber).change(
      function(ev) {
        self.filter.toggleRegex();
        self.updateResults();
        return false;
      });

    thisForm.find('#filterInclude' + self.filterNumber).change(
      function(ev) {
        if ($(this).val() == 'Include') {
          self.filter.include = true;
        } else {
          self.filter.include = false;
        }
        self.updateResults();
        return false;
      });

    thisForm.find('#filterRemove' + self.filterNumber).click(
      function(ev){
        var body = $('body');
        var currentBottom = parseInt(body.css('padding-bottom'));
        var height = $(this).parent().outerHeight(true);
        body.css('padding-bottom', (currentBottom - height) + 'px');
        $(this).parent().remove();
        // todo remove
        self.filter.enabled = false;
        self.updateResults();
        self.updateFilterButtons();
        return false;
      });

    thisForm.find('.filter-up').click(
      function(ev) {
        var index = parent.filters.indexOf(self.filter);

        if (index < 0){
          console.error('this is not possible');
        } else {
          if (index > 1) {
            parent.filters[index] = parent.filters[index-1];
            parent.filters[index-1] = self.filter;
            var thisForm = $(this).parent();
            var upForm = thisForm.prev();
            upForm.before(thisForm);
            self.updateResults();
            self.updateFilterButtons();
          }
        }
        return false;
      });

    thisForm.find('.filter-down').click(
      function(ev) {
        var index = parent.filters.indexOf(self.filter);
        if (index < 0){
          console.error('this is not possible');
        } else {
          if (index < (parent.filters.length - 1)) {
            parent.filters[index] = parent.filters[index+1];
            parent.filters[index+1] = self.filter;
            var thisForm = $(this).parent();
            var downForm = thisForm.next();
            downForm.after(thisForm);
            self.updateResults();
            self.updateFilterButtons();
          }
        }
        return false;
      });

    var locationButton = thisForm.find('#filterLocation' + self.filterNumber);
    locationButton.button('toggle');
    locationButton.click(
      function(ev){
        self.filter.toggleWhere('Location');
        $(this).button('toggle');
        self.updateResults();
        return false;
      });

    thisForm.find('#filterNode' + self.filterNumber)
      .button('toggle')
      .click(
        function(ev){
        self.filter.toggleWhere('Node');
          $(this).button('toggle');
          self.updateResults();
          return false;
        });
    thisForm.find('#filterMessage' + self.filterNumber)
      .button('toggle')
      .click(
        function(ev){
          self.filter.toggleWhere('Message');
          $(this).button('toggle');
          self.updateResults();
          return false;
      });
    thisForm.find('#filterTopics' + self.filterNumber)
      .button('toggle')
      .click(
        function(ev){
          self.filter.toggleWhere('Topics');
          $(this).button('toggle');
          self.updateResults();
          return false;
        });

    self.updateFilterButtons();
  };
};


/**
 * generate filter view html
 * @param {Number} filterNumber
 * @returns {String} filter html
 */
wxconsole.generateFilterHTML = function(filterNumber) {
  return '<form class="form-inline filter-input" id="filterForm' + filterNumber + '">' +
    '<button class="btn" id="filter_enabled' + filterNumber + '" data-toggle="button">Enabled</button>' +
    '<input type="text" class="input-small span2" id="filterText' + filterNumber + '">' +
    '<select id="filterInclude' + filterNumber + '" class="span2">' +
    '<option>Include</option>' +
    '<option>Exclude</option>' +
    '</select>' +
    '<label class="checkbox">' +
    '<input type="checkbox" id="filterRegExCheck' + filterNumber + '"> Regex' +
    '</label>' +
    '<strong>From</strong>' +
    '<button class="btn" id="filterMessage' + filterNumber + '">Message</button>' +
    '<button class="btn" id="filterNode' + filterNumber + '">Node</button>' +
    '<button class="btn" id="filterLocation' + filterNumber + '">Location</button>' +
    '<button class="btn" id="filterTopics' + filterNumber + '">Topics</button>' +
    '<button class="btn btn-danger" id="filterRemove' + filterNumber + '">' +
    '<i class="icon-minus-sign"></i></button>' +
    '<button class="btn filter-down" id="filterDown' + filterNumber + '"><i class="icon-arrow-down"></i></button>' +
    '<button class="btn filter-up" id="filterUp' + filterNumber + '"><i class="icon-arrow-up"></i></button>' +
    '</form>';
};

/**
 * @class Message Controller
 * @param {Number} bufferSize number of messaged for displayed
 */
wxconsole.MessageViewController = function(bufferSize) {

  /**
   * max messages displayed in table
   * @type Number
   */
  this.MaxNumberOfDisplayedMessages = bufferSize;

  /**
   * browser title. default is 'wxconsole'
   * @type String
   */
  this.titleString = 'wxconsole';
  /**
   * additional title string (websocket uri)
   * @type String
   */
  this.uri = '';

  /**
   * id of table for display. default is 'rosout_table'.
   * @type String
   */
  this.tableId = 'rosout_table';
  /**
   * id of message field.  default is 'message'.
   * @type String
   */
  this.messageId = 'message';
  /**
   * paused or running
   * @type boolean
   */
  this.isPaused = false;
  this.filters = new Array();
  var siverityFilter_ = new wxconsole.SeverityFilter();
  this.filters.push(siverityFilter_);

  this.filterControllers = new Array();
  this.messages = new Array();

  var self = this;

  this.addFilter = function(){
    // minus 1 is for severity filter
    var filterNumber = self.filters.length - 1;
    // model
    var newFilter = new wxconsole.SearchFilter('Search' + filterNumber);
    self.filters.push(newFilter);

    // view
    $('#filters').append(wxconsole.generateFilterHTML(filterNumber));

    // controller
    var filterController = new wxconsole.SearchFilterViewController(filterNumber, newFilter, self);
    filterController.init();
    self.filterControllers.push(filterController);

    var body = $('body');
    var currentBottom = parseInt(body.css('padding-bottom'));
    var height = $('#filterForm' + filterNumber).outerHeight(true);
    body.css('padding-bottom', (currentBottom + height) + 'px');
  };

  /**
   * Toggles paused/resumed state of level
   * @param {String} levelText one of Debug/Info/Warn/Error/Fatal
   */
  this.toggleSelectedLevel = function(levelText){
    siverityFilter_.toggleSelectedLevel(levelText);
  };

  /**
   * Toggles all pause/resume state
   */
  this.togglePause = function(){
    self.isPaused = !self.isPaused;
  };

  this.onCloseCallback = function() {
    $('#' + self.messageId).append(
      '<div class="alert alert-block alert-error">'
        + '<a class="close" data-dismiss="alert" href="#">x</a>'
        + '<strong>Error!</strong> rosbridge connection closed</div>')
      .delay(5000).fadeOut(1000);
  };

  this.onErrorCallback = function (e) {
    $('#' + self.messageId).append(
      '<div class="alert alert-block alert-error">'
        + '<a class="close" data-dismiss="alert" href="#">x</a>'
        + '<strong>Error!</strong> rosbridge error has occered</div>')
      .delay(5000).fadeOut(1000);
  };

  this.generateTableRowFromMessage = function(msg, id) {
    var location = wxconsole.generateLocationString(msg);
    var maxLocationLength = 50;
    if (location.length  > maxLocationLength) {
      location = location.substring(0, maxLocationLength) + '...';
    }
    var topics = msg.topics.join(', ').toString();
    var maxTopicsLength = 50;
    if (topics.length  > maxTopicsLength) {
      topics = topics.substring(0, maxTopicsLength) + '...';
    }
    return '<tr id="' + id + '">' +
      '<td><i class="' + wxconsole.levelToTBIcon(msg.level) +
      '"></i>' +
      '<a onclick="$(\'#modal_message' + self.messages.length + '\').modal()" class="' + wxconsole.levelToString(msg.level) + '">' + msg.msg + '</a>' +
      '<div id="modal_message' + self.messages.length + '" class="modal hide">' +
      '<div class="modal-header">'+
      '<button type="button" class="close" data-dismiss="modal">x</button>' +
      '<h3>Message</h3>' +
      '</div>' +
      '<div class="modal-body">' +
      wxconsole.messageToHTML(msg) +
      '</div>' +
      '<div class="modal-footer">'+
      '<a href=\"#\" class=\"btn\" data-dismiss="modal">Close</a>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td><span class="label ' +
      wxconsole.levelToTBLabel(msg.level) + '">'
      + wxconsole.levelToString(msg.level) + '</span></td>' +
      '<td class="break-word">' + msg.name + '</td>' +
      '<td class="break-word">' + msg.header.stamp.secs + '.' + msg.header.stamp.nsecs + '</td>' +
      '<td class="break-word">' + topics + '</td>' +
      '<td class="break-word">' + location + '</td>' +
      '</tr>';
  };

  this.reject = function(msg) {
    for (var i = 0;  i < self.filters.length; i++) {
      if (self.filters[i].reject(msg)) {
        return true;
      }
    }
    return false;
  };

  this.updateAllMessageFilteringResult = function() {
    for (var i = 0;  i < self.messages.length; i++) {
      if (self.reject(self.messages[i])) {
        $('#logTable' + i).addClass('hide');
      } else {
        $('#logTable' + i).removeClass('hide');
      }
    }
  };

  this.onMessageCallback = function(msg) {
    var id = 'logTable' + self.messages.length;
    $('#' + self.tableId + ' > tbody:last').append(self.generateTableRowFromMessage(msg, id));
    if (self.isPaused || self.reject(msg)) {
      // hide temporally
      $('#' + id).addClass('hide');
    } else {
      // scroll to bottom
      $('html, body').animate({scrollTop: $('#' + self.messageId).offset().top}, 0);
    }
    self.messages.push(msg);
    if (self.messages.length > self.MaxNumberOfDisplayedMessages) {
      self.messages.shift();
      $('#' + self.tableId + ' > tbody').contents().first().remove();
    }
  };

  this.onConnectedCallback = function() {
    $('#' + self.messageId).children().fadeOut(100);
    $('#' + self.messageId).append(
      '<div class="alert alert-block alert-success id="connection_alert">'
        + '<a class="close" data-dismiss="alert" href="#">&times</a>'
        + '<strong>Success!</strong> rosbridge connection established</div>');
    $('#' + self.messageId).children().delay(3000).fadeOut(1000);
    document.title = self.titleString + ' [' + self.uri + ']';
  };

  this.clear = function(){
    $('#' + self.tableId + ' > tbody:last').html("");
    self.messages = new Array();
  };
};

/**
 * @class connection controller for rosbridge version1
 * @param {String} host
 * @param {Number} port
 * @param {String} topic
 * @param {wxconsole.MessageViewController} controller
 * @see http://rosbridge.org
 */
wxconsole.Rosbridge1Adaptor = function(host, port, topic, controller) {
  this.host = host;
  this.port = port;
  this.topic = topic;
  this.controller = controller;

  var conection_ = null;
  var self = this;

  /**
   * version name of rosbridge
   * @description this is used in html id. if you want to change this,
   * check html source.
   * @type {String}
   */
  this.ROSBRIDGE_VERSION = '1.0';

  this.connect = function(){
    try {
      connection_.handlers = new Array();
      connection_.callService('/rosjs/subscribe',
                              [self.topic, -1],
                            function(e){});

    } catch (error) {
      console.error('Problem subscribing!');
      return;
    }
    connection_.addHandler(self.topic, self.controller.onMessageCallback);
    self.controller.uri = wxconsole.MakeWebsocketUri(self.host, self.port);
    self.controller.onConnectedCallback();
  };

  /**
   * close the websocket connection
   */
  this.close = function(){
    if (connection_ != null) {
      try {
        connection_.socket.close();
        connection_.handlers = new Array(); // rosws bug?
      } catch (x) {
        console.log('rosbridge1 close error: ' + x);
      }
    }
  };

  /**
   * Initialize connection
   */
  this.init = function(){
    self.controller.clear();

    close();
    connection_ = new ros.Connection(
      wxconsole.MakeWebsocketUri(self.host, self.port));
    // clear
    connection_.setOnClose(self.controller.onCloseCallback);
    connection_.setOnError(self.controller.onErrorCallback);
    connection_.setOnOpen(self.connect);
  };
};


/**
 * @class connection controller for rosbridge version2
 * @param {String} host
 * @param {Number} port
 * @param {String} topic
 * @param {wxconsole.MessageViewController} controller
 * @see http://rosbridge.org
 */
wxconsole.Rosbridge2Adaptor = function(host, port, topic, controller) {
  this.host = host;
  this.port = port;
  this.topic = topic;
  this.controller = controller;

  var conection_ = null;
  var self = this;

  /**
   * version name of rosbridge
   * @description this is used in html id. if you want to change this,
   * check html source.
   * @const
   * @type {String}
   */
  this.ROSBRIDGE_VERSION = '2.0';

  this.connect = function(e){
    try {
      connection_.unsubscribe(self.topic);
    } catch (x) {
      // don't care
      console.info('error in unsubscribe, this can be ignored');
    }

    try {
      connection_.subscribe(self.controller.onMessageCallback,
                            self.topic);
    } catch(error) {
      console.error('problem in registering: ' + error);
      return;
    }
    self.controller.uri = wxconsole.MakeWebsocketUri(self.host, self.port);
    self.controller.onConnectedCallback();
  };

  /**
   * unsubscribe and close
   */
  this.close = function() {
    if (connection_ != null) {
      try {
        connection_.unsubscribe(this.topic);
        connection_.socket.close();
      } catch (x) {
        // ignore closing error
        console.log('rosbridge2 close error ' + x);
      }
    }
  };

  /**
   * initialize and connect to websocket
   */
  this.init = function(){

    self.controller.clear();

    close();
    connection_ = new ros.Bridge(
      wxconsole.MakeWebsocketUri(self.host, self.port));
    // clear
    connection_.onClose = self.controller.onCloseCallback;
    connection_.onError = self.controller.onErrorCallback;
    connection_.onOpen = self.connect;
  };
};

/**
 * select adaptor by rosbridge version
 * @param {String} version version string 1.0 or 2.0
 */
wxconsole.setRosbridgeVersion = function(version) {
  if (version == '1.0') {
    wxconsole.Adaptor = wxconsole.Rosbridge1Adaptor;
  } else if (version == '2.0') {
    wxconsole.Adaptor = wxconsole.Rosbridge2Adaptor;
  } else {
    console.error('unsupportd rosbridge version');
  }
};

/**
 * create wxconsole Application
 * @class wxconsole Application class
 */
wxconsole.App = function() {
  var adaptor = null;
  var hostname = "";
  var port = 9090;
  var bufferSize = 500;
  var version = '2.0';
  var topic = '/rosout_agg';


  /**
   * get cookie data.
   */
  this.getCookies = function(){
    // initialize controller
    var cookieBufferSize = $.cookie('bufferSize');
    if (cookieBufferSize) {
      bufferSize = cookieBufferSize;
    }
    // set initial value from cookie
    var cookiePortNumber = $.cookie('portNumber');
    if (cookiePortNumber) {
      port = cookiePortNumber;
    }
    var cookieTopic = $.cookie('topic');
    if (cookieTopic) {
      topic = cookieTopic;
    }

    hostname = $.cookie('hostname');

    version = $.cookie('rosbridgeVersion');
    if (version == null) {
      // default is version 2.0
      if (ros.Bridge != undefined) {
        wxconsole.setRosbridgeVersion('2.0');
      } else if (ros.Connection != undefined) {
        wxconsole.setRosbridgeVersion('1.0');
      } else {
        console.error('ros.js is not included');
      }
    } else {
      wxconsole.setRosbridgeVersion(version);
    }
  };


  /**
   * initialize wxconsole app
   */
  this.init = function() {
    $('.nav-tabs').button();
    $(".alert").alert();
    $('#level_buttons > .btn').button('toggle');

    this.getCookies();
    var controller = new wxconsole.MessageViewController(bufferSize);

    if (hostname == "" || hostname == null) {
      $('#hostname').val("localhost");
    } else {
      $('#hostname').val(hostname);
      console.log('auto connect using cookie:' +
                  hostname + ':' + port + ':' + topic);
      adaptor = new wxconsole.Adaptor(hostname, port, topic, controller);
      adaptor.init();
    }

    $('#set_hostname').submit(
      function(){
        var hostname = $('#hostname').val();
        $.cookie('hostname', hostname);
        if (adaptor != null){
          adaptor.close();
          delete adaptor;
        }
        adaptor = new wxconsole.Adaptor(hostname, port, topic, controller);
        adaptor.init();
        return false;
      });

    $('#level_buttons > .btn').click(
      function(){
        controller.toggleSelectedLevel($(this).text());
        controller.updateAllMessageFilteringResult();
        $(this).button('toggle');
      });
    $('#pause_button').click(
      function(){
        controller.togglePause();
        $(this).button('toggle');
      });
    $('#add_filter_button').click(
      function(ev) {
        controller.addFilter();
      });
    $('#clear_button').click(
      function(){
        controller.clear();
      });
    $('#setting_button').click(
      function(){
        $('#rosout_topic_input').val(adaptor.topic);
        $('#buffer_size_input').val(controller.MaxNumberOfDisplayedMessages);
        $('#port_number_input').val(adaptor.port);
        $('input[name="rosbridgeVersion"]').val([adaptor.ROSBRIDGE_VERSION]);
        $('#modal_setting').modal();
      });
    $('#setup_submit').click(
      function(){
        var topic = $('#rosout_topic_input').val();
        var inputBufferSize = $('#buffer_size_input').val();
        var version = $('input[name="rosbridgeVersion"]:checked').val();
        var newPortNumber = $('#port_number_input').val();

        $.cookie('topic', topic);
        $.cookie('rosbridgeVersion', version);
        $.cookie('portNumber', newPortNumber);
        $.cookie('bufferSize', inputBufferSize);

        // if version is changed, create new wx instance
        if (version != adaptor.ROSBRIDGE_VERSION ||
            newPortNumber != port) {
          if (adaptor != null){
            adaptor.close();
            delete adaptor;
          }
          var hostname = $('#hostname').val();
          wxconsole.setRosbridgeVersion(version);
          port = newPortNumber;
          bufferSize = inputBufferSize;
          controller.MaxNumberOfDisplayedMessages = inputBufferSize;
          adaptor = new wxconsole.Adaptor(hostname, port, topic, controller);
          adaptor.init();
        } else {
          // set variables to current wx instance
          adaptor.topic = topic;
          controller.MaxNumberOfDisplayedMessages = inputBufferSize;
          // reconnect
          adaptor.connect();
        }
      });
  };
};

$(function() {
    (function(){
       var app = new wxconsole.App();
       app.init();
     }());
  });
