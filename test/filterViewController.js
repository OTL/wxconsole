
test('wxconsole.generateFilterHTML', function() {
      equal(wxconsole.generateFilterHTML(1), 
	   '<form class="form-inline filter-input" id="filterForm1"><button class="btn" id="filter_enabled1" data-toggle="button">Enabled</button><input type="text" class="input-small span2" id="filterText1"><select id="filterInclude1" class="span2"><option>Include</option><option>Exclude</option></select><label class="checkbox"><input type="checkbox" id="filterRegExCheck1"> Regex</label><strong>From</strong><button class="btn" id="filterMessage1">Message</button><button class="btn" id="filterNode1">Node</button><button class="btn" id="filterLocation1">Location</button><button class="btn" id="filterTopics1">Topics</button><button class="btn btn-danger" id="filterRemove1"><i class="icon-minus-sign"></i></button><button class="btn filter-down" id="filterDown1"><i class="icon-arrow-down"></i></button><button class="btn filter-up" id="filterUp1"><i class="icon-arrow-up"></i></button></form>'
	   );
     });

test('SearchFilter.stringInclude', function() {
       var filter = new wxconsole.SearchFilter('aa');
       var parent = new function() {
	 var self = this;
	 this.updated = false;
	 this.updateAllMessageFilteringResult = function() {
	   self.updated = true;
	 };
       };
       var filterTop = $('#filters');

       filterTop.append(wxconsole.generateFilterHTML(0));
       var viewController0 = new wxconsole.SearchFilterViewController(0, filter, parent);
       equal(viewController0.filter, filter);

       viewController0.init();

       ok(filterTop.find('#filterForm0 button:nth-child(12)').hasClass('disabled'),
	  'up should be disabled');
       ok(filterTop.find('#filterForm0 button:nth-child(11)').hasClass('disabled'),
	  'down should be disabled');

       // more filter
       filterTop.append(wxconsole.generateFilterHTML(1));
       var viewController1 = new wxconsole.SearchFilterViewController(1, filter, parent);

       viewController1.init();
       ok(filterTop.find('#filterForm0 button:nth-child(12)').hasClass('disabled'),
	  'up should be disabled');
       ok(!filterTop.find('#filterForm0 button:nth-child(11)').hasClass('disabled'),
	  'down should be enabled');
       ok(!filterTop.find('#filterForm1 button:nth-child(12)').hasClass('disabled'),
	  'up should be enabled');
       ok(filterTop.find('#filterForm1 button:nth-child(11)').hasClass('disabled'),
	  'down should be disabled');

       // more more filter
       filterTop.append(wxconsole.generateFilterHTML(2));
       var viewController2 = new wxconsole.SearchFilterViewController(2, filter, parent);

       viewController2.init();
       ok(filterTop.find('#filterForm0 button:nth-child(12)').hasClass('disabled'),
	  'up should be disabled');
       ok(!filterTop.find('#filterForm0 button:nth-child(11)').hasClass('disabled'),
	  'down should be enabled');
       ok(!filterTop.find('#filterForm1 button:nth-child(12)').hasClass('disabled'),
	  'up should be enabled');
       ok(!filterTop.find('#filterForm1 button:nth-child(11)').hasClass('disabled'),
	  'down should be enabled');
       ok(!filterTop.find('#filterForm2 button:nth-child(12)').hasClass('disabled'),
	  'up should be enabled');
       ok(filterTop.find('#filterForm2 button:nth-child(11)').hasClass('disabled'),
	  'down should be disabled');

       // test of include
       ok(viewController0.filter.include);
       //........
     });
     