test("levelToString", function() {
       equal(wxconsole.levelToString(-1), 'Unknown');
       equal(wxconsole.levelToString(0), 'Unknown');
       equal(wxconsole.levelToString(0.1), 'Unknown');
       equal(wxconsole.levelToString(1), 'Debug');
       equal(wxconsole.levelToString(2), 'Info');
       equal(wxconsole.levelToString(3), 'Info');
       equal(wxconsole.levelToString(4), 'Warn');
       equal(wxconsole.levelToString(5), 'Warn');
       equal(wxconsole.levelToString(8), 'Error');
       equal(wxconsole.levelToString(15), 'Error');
       equal(wxconsole.levelToString(16), 'Fatal');
       equal(wxconsole.levelToString(999999999999999), 'Fatal');
     });

test('levelToTBIcon', function() {
       equal(wxconsole.levelToTBIcon(-1), 'icon-leaf');
       equal(wxconsole.levelToTBIcon(0), 'icon-leaf');
       equal(wxconsole.levelToTBIcon(0.1), 'icon-leaf');
       equal(wxconsole.levelToTBIcon(1), 'icon-pencil');
       equal(wxconsole.levelToTBIcon(2), 'icon-info-sign');
       equal(wxconsole.levelToTBIcon(3), 'icon-info-sign');
       equal(wxconsole.levelToTBIcon(4), 'icon-exclamation-sign');
       equal(wxconsole.levelToTBIcon(5), 'icon-exclamation-sign');
       equal(wxconsole.levelToTBIcon(8), 'icon-remove-sign');
       equal(wxconsole.levelToTBIcon(15), 'icon-remove-sign');
       equal(wxconsole.levelToTBIcon(16), 'icon-remove');
       equal(wxconsole.levelToTBIcon(999999999999999), 'icon-remove');
     });

test('levelToTBLabel', function() {
       equal(wxconsole.levelToTBLabel(-1), '');
       equal(wxconsole.levelToTBLabel(0), '');
       equal(wxconsole.levelToTBLabel(0.1), '');
       equal(wxconsole.levelToTBLabel(1), '');
       equal(wxconsole.levelToTBLabel(2), 'label-info');
       equal(wxconsole.levelToTBLabel(3), 'label-info');
       equal(wxconsole.levelToTBLabel(4), 'label-warning');
       equal(wxconsole.levelToTBLabel(5), 'label-warning');
       equal(wxconsole.levelToTBLabel(8), 'label-important');
       equal(wxconsole.levelToTBLabel(15), 'label-important');
       equal(wxconsole.levelToTBLabel(16), 'label-inverse');
       equal(wxconsole.levelToTBLabel(999999999999999), 'label-inverse');
     });

test('MakeWebsocketUri', function() {
       equal(wxconsole.MakeWebsocketUri('hoge', 1), 'ws://hoge:1');
       equal(wxconsole.MakeWebsocketUri('', 0), 'ws://:0');
       equal(wxconsole.MakeWebsocketUri('localhost', 9090), 'ws://localhost:9090');
       });

test('messageToHTML', function() {
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
       equal(wxconsole.messageToHTML(msg1), "<p><strong>Node: </strong>/node1</p><p><strong>Time: </strong>100.123</p><p><strong>Severity: </strong>Warn</p><p><strong>Location: </strong>main.c:in `Func()':145</p><p><strong>Published Topics: </strong>/topic1,/topic2,/rosout</p><p /><h3>this is test message</h3>");
});
