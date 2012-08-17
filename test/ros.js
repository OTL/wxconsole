test('setRosbridgeVersion', function() {
       wxconsole.setRosbridgeVersion('1.0');
       equal(wxconsole.Adaptor, wxconsole.Rosbridge1Adaptor);
       wxconsole.setRosbridgeVersion('2.0');
       equal(wxconsole.Adaptor, wxconsole.Rosbridge2Adaptor);
});

test('Rosbridge1Adaptor', function() {
       var controller = {
       };
       var adaptor = new wxconsole.Rosbridge1Adaptor('h1', 100, '/hoge', controller);
       equal(adaptor.host, 'h1');
       equal(adaptor.port, 100);
       equal(adaptor.topic, '/hoge');
       equal(adaptor.controller, controller);
       equal(adaptor.ROSBRIDGE_VERSION, '1.0');
});

test('Rosbridge2Adaptor', function() {
       var controller = {
       };
       var adaptor = new wxconsole.Rosbridge2Adaptor('h1', 100, '/hoge', controller);
       equal(adaptor.host, 'h1');
       equal(adaptor.port, 100);
       equal(adaptor.topic, '/hoge');
       equal(adaptor.controller, controller);
       equal(adaptor.ROSBRIDGE_VERSION, '2.0');
});

