test('MessageHTMLConverter', function() {
       var controller = new wxconsole.MessageHTMLConverter();
       equal(controller.MaxNumberOfDisplayedMessages, 500);
       equal(controller.titleString, 'wxconsole');
       equal(controller.tableId, 'rosout_table');
       equal(controller.messageId, 'message');
       equal(controller.isPaused, false);
     });

test('MessageHTMLConverter.contructor2', function() {
       var controller = new wxconsole.MessageHTMLConverter(10);
       equal(controller.MaxNumberOfDisplayedMessages, 10);
       equal(controller.titleString, 'wxconsole');
       equal(controller.isPaused, false);
       equal(controller.tableId, 'rosout_table');
       equal(controller.messageId, 'message');

     });

test('MessageHTMLConverter.togglePause', function() {
       var controller = new wxconsole.MessageHTMLConverter();
       equal(controller.isPaused, false);
       controller.togglePause();
       equal(controller.isPaused, true);
       controller.togglePause();
       equal(controller.isPaused, false);
     });

test('MessageHTMLConverter.generateTableRowFromMessage', function() {
       var msg1 = {
	 name : '/node1',
	 header : { stamp : {secs : 100,
			     nsecs : 123},
		    frame_id : 'frame1'},
	 level : 4,
	 file : 'main.c',
	 function : 'Func()',
	 line : 145,
	 topics : ['/topic1', '/topic2', '/rosout'],
	 msg : 'this is test message'
       };
       var controller = new wxconsole.MessageHTMLConverter();
       equal(controller.generateTableRowFromMessage(msg1),
	     "<tr><td><i class=\"icon-exclamation-sign\"></i><a onclick=\"$('#modal_message0').modal()\" class=\"Warn\">this is test message</a><div id=\"modal_message0\" class=\"modal hide\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">x</button><h3>Message</h3></div><div class=\"modal-body\"><p><strong>Node: </strong>/node1</p><p><strong>Time: </strong>100.123</p><p><strong>Severity: </strong>Warn</p><p><strong>Location: </strong>main.c:in `Func()':145</p><p><strong>Published Topics: </strong>/topic1,/topic2,/rosout</p><p /><h3>this is test message</h3></div><div class=\"modal-footer\"><a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Close</a></div></div></td><td><span class=\"label label-warning\">Warn</span></td><td class=\"break-word\">/node1</td><td class=\"break-word\">100.123</td><td class=\"break-word\">/topic1,/topic2,/rosout</td><td class=\"break-word\">main.c:in `Func()':145</td></tr>"
	    );
     });
