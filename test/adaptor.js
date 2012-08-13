test('Rosbridge1Adaptor.construct', function() {
       var adaptor = new wxconsole.Rosbridge1Adaptor('host1', 9099, '/rosout_agg');
       equal(adaptor.host, 'host1');
       equal(adaptor.port, 9099);
       equal(adaptor.topic, '/rosout_agg');
       equal(adaptor.ROSBRIDGE_VERSION, '1.0');
});

test('Rosbridge2Adaptor.construct', function() {
       var adaptor = new wxconsole.Rosbridge2Adaptor('host2', 9090, '/rosout_agg2');
       equal(adaptor.host, 'host2');
       equal(adaptor.port, 9090);
       equal(adaptor.topic, '/rosout_agg2');
       equal(adaptor.ROSBRIDGE_VERSION, '2.0');
});

