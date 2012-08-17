test('MessageViewController', function() {
       var controller = new wxconsole.MessageViewController(500);
       equal(controller.MaxNumberOfDisplayedMessages, 500);
       equal(controller.titleString, 'wxconsole');
       equal(controller.tableId, 'rosout_table');
       equal(controller.messageId, 'message');
       equal(controller.isPaused, false);
     });

test('MessageViewController.contructor2', function() {
       var controller = new wxconsole.MessageViewController(10);
       equal(controller.MaxNumberOfDisplayedMessages, 10);
       equal(controller.titleString, 'wxconsole');
       equal(controller.isPaused, false);
       equal(controller.tableId, 'rosout_table');
       equal(controller.messageId, 'message');

     });

test('MessageViewController.togglePause', function() {
       var controller = new wxconsole.MessageViewController(500);
       equal(controller.isPaused, false);
       controller.togglePause();
       equal(controller.isPaused, true);
       controller.togglePause();
       equal(controller.isPaused, false);
     });

test('MessageViewController.generateTableRowFromMessage', function() {
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
       var controller = new wxconsole.MessageViewController(500);
       equal(controller.generateTableRowFromMessage(msg1, 'id1'),
             '<tr id="id1"><td><i class="icon-exclamation-sign"></i><a onclick="$(\'#modal_message0\').modal()" class="Warn">this is test message</a><div id="modal_message0" class="modal hide"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">x</button><h3>Message</h3></div><div class="modal-body"><p><strong>Node: </strong>/node1</p><p><strong>Time: </strong>100.123</p><p><strong>Severity: </strong>Warn</p><p class="break-word"><strong>Location: </strong>main.c:in `Func()\':145</p><p class="break-word"><strong>Published Topics: </strong>/topic1, /topic2, /rosout</p><p /><h3>this is test message</h3></div><div class="modal-footer"><a href="#" class="btn" data-dismiss="modal">Close</a></div></div></td><td><span class="label label-warning">Warn</span></td><td class="break-word">/node1</td><td class="break-word">100.123</td><td class="break-word">/topic1, /topic2, /rosout</td><td class="break-word">main.c:in `Func()\':145</td></tr>'
            );
     });

test('MessageViewController.onMessageCallback', function() {
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
       var msg2 = {
         name : '/node2',
         header : { stamp : {secs : 100,
                             nsecs : 123},
                    frame_id : 'frame1'},
         level : 1,
         file : 'main.c',
         function : 'Func()',
         line : 146,
         topics : ['/topic1', '/topic2', '/rosout'],
         msg : 'this is test message2'
       };
       var msg3 = {
         name : '/node3',
         header : { stamp : {secs : 100,
                             nsecs : 123},
                    frame_id : 'frame1'},
         level : 1,
         file : 'main.c',
         function : 'Func()',
         line : 146,
         topics : ['/topic1', '/topic2', '/rosout'],
         msg : 'this is test message3'
       };

       var controller = new wxconsole.MessageViewController(2);
       controller.onMessageCallback(msg1);
       // check #logTable0
       // not hide
       ok(!$('#logTable0').hasClass('hide'));
       equal($('#logTable0').parent().html(),
             "<tr id=\"logTable0\"><td><i class=\"icon-exclamation-sign\"></i><a onclick=\"$('#modal_message0').modal()\" class=\"Warn\">this is test message</a><div id=\"modal_message0\" class=\"modal hide\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">x</button><h3>Message</h3></div><div class=\"modal-body\"><p><strong>Node: </strong>/node1</p><p><strong>Time: </strong>100.123</p><p><strong>Severity: </strong>Warn</p><p class=\"break-word\"><strong>Location: </strong>main.c:in `Func()':145</p><p class=\"break-word\"><strong>Published Topics: </strong>/topic1, /topic2, /rosout</p><p></p><h3>this is test message</h3></div><div class=\"modal-footer\"><a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Close</a></div></div></td><td><span class=\"label label-warning\">Warn</span></td><td class=\"break-word\">/node1</td><td class=\"break-word\">100.123</td><td class=\"break-word\">/topic1, /topic2, /rosout</td><td class=\"break-word\">main.c:in `Func()':145</td></tr>");
       // check messages
       equal(controller.messages.length, 1);
       deepEqual(controller.messages[0], msg1);
       // again

       // severity level filter
       controller.toggleSelectedLevel('Debug');
       controller.onMessageCallback(msg2);
       ok($('#logTable1').hasClass('hide'));
       equal(controller.messages.length, 2);
       deepEqual(controller.messages[1], msg2);

//       console.log($('#logTable1').parent().html());
//       ok($('#logTable1 tr').hasClass('hide'));

       // more than max message
       controller.toggleSelectedLevel('Debug');
       controller.onMessageCallback(msg3);
       // only 2
       equal(controller.messages.length, 2, 'first message is removed');
       // shift
       deepEqual(controller.messages[0], msg2, 'messages is shifted');
       deepEqual(controller.messages[1], msg3, 'messages is shifted');
       equal($('#logTable0').length, 0); // removed
       equal($('#logTable1').length, 1);
       equal($('#logTable2').length, 1);

       // clear
       controller.clear();
       equal(controller.messages.length, 0);
       equal($('#logTable0').length, 0); // removed
       equal($('#logTable1').length, 0); // removed
       equal($('#logTable2').length, 0); // removed

     });
