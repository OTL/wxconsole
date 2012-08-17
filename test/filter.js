test('SearchFilter', function() {
       var filter = new wxconsole.SearchFilter('aa');
       equal(filter.name, 'aa');
       equal(filter.enabled, true);
       equal(filter.text, '');
       equal(filter.include, true);
       equal(filter.regex, false);
       equal(filter.where['Message'], true);
       equal(filter.where['Node'], true);
       equal(filter.where['Location'], true);
       equal(filter.where['Topics'], true);
       
     });

test('SearchFilter.stringInclude', function() {
       var filter = new wxconsole.SearchFilter('aa');
       filter.text = 'hoge';
       ok(filter.stringInclude('hogeaaa'));
       ok(filter.stringInclude('bbbbhogeaaa'));
       ok(!filter.stringInclude('bbbbhogaaa'));
       filter.text = 'ho+ge';
       ok(!filter.stringInclude('hogeaaa'));
       ok(!filter.stringInclude('bbbbhogeaaa'));
       ok(!filter.stringInclude('bbbbhogaaa'));
       ok(!filter.stringInclude('bbbbhoooogaaa'));
     });

test('SearchFilter.regexInclude', function() {
       var filter = new wxconsole.SearchFilter('aa');
       filter.text = 'hoge';
       ok(filter.regexInclude('hogeaaa'));
       ok(filter.regexInclude('bbbbhogeaaa'));
       ok(!filter.regexInclude('bbbbhogaaa'));
       filter.text = 'ho+ge';
       ok(filter.regexInclude('hogeaaa'));
       ok(filter.regexInclude('bbbbhogeaaa'));
       ok(filter.regexInclude('bbbbhogeaa'));
       ok(filter.regexInclude('bbbbhoooooogeaa'));
       ok(!filter.regexInclude('bbbbhgeaa'));
     });

test('SearchFilter.reject', function() {
       var filter = new wxconsole.SearchFilter('aa');

       filter.text = 'node1';
       filter.enabled = false;
       var msg = {
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
       ok(!filter.reject(msg));
       filter.enabled = true;
       ok(!filter.reject(msg));
       filter.text = 'aaaa';
       ok(filter.reject(msg));
       filter.text = 'node';
       filter.where['Message'] = false;
       filter.where['Location'] = false;
       filter.where['Topics'] = false;
       ok(!filter.reject(msg));
       filter.text = 'nodeaaa';
       ok(filter.reject(msg));
       // include
       
     });

test('SeverityFilter.reject', function() {
       var filter = new wxconsole.SeverityFilter();
       equal(filter.name, 'SeverityFilter');
       var msgDebug = {level: 1};
       var msgInfo = {level: 2};
       var msgWarn = {level: 4};
       var msgError = {level: 8};
       var msgFatal = {level: 16};
       ok(!filter.reject(msgDebug));
       ok(!filter.reject(msgInfo));
       ok(!filter.reject(msgWarn));
       ok(!filter.reject(msgError));
       ok(!filter.reject(msgFatal));
       filter.toggleSelectedLevel('Debug');

       ok(filter.reject(msgDebug));
       ok(!filter.reject(msgInfo));
       ok(!filter.reject(msgWarn));
       ok(!filter.reject(msgError));
       ok(!filter.reject(msgFatal));
       filter.toggleSelectedLevel('Info');
       ok(filter.reject(msgDebug));
       ok(filter.reject(msgInfo));
       ok(!filter.reject(msgWarn));
       ok(!filter.reject(msgError));
       ok(!filter.reject(msgFatal));
       filter.toggleSelectedLevel('Warn');
       ok(filter.reject(msgDebug));
       ok(filter.reject(msgInfo));
       ok(filter.reject(msgWarn));
       ok(!filter.reject(msgError));
       ok(!filter.reject(msgFatal));
       filter.toggleSelectedLevel('Error');
       ok(filter.reject(msgDebug));
       ok(filter.reject(msgInfo));
       ok(filter.reject(msgWarn));
       ok(filter.reject(msgError));
       ok(!filter.reject(msgFatal));
       filter.toggleSelectedLevel('Fatal');
       ok(filter.reject(msgDebug));
       ok(filter.reject(msgInfo));
       ok(filter.reject(msgWarn));
       ok(filter.reject(msgError));
       ok(filter.reject(msgFatal));
       filter.toggleSelectedLevel('Info');
       ok(filter.reject(msgDebug));
       ok(!filter.reject(msgInfo));
       ok(filter.reject(msgWarn));
       ok(filter.reject(msgError));
       ok(filter.reject(msgFatal));
});

