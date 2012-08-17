wxconsole
========================

wxconsole is web rxconsole.

You can try it from here.

http://otl.github.com/wxconsole/


How to use
------------------------
At first, you have to run rosbridge.
Then please access to http://otl.github.com/wxconsole/ in your browser.
Input your rosbridge's host name to the top navbar form.
and press enter.

wxconsole supports rosbridge version 1.0
and version 2.0. Default is version 2.0.
If you are using rosbridge version 1.0, push the 'Setup' button
of the bottom. Then please select rosbridge 1.0.

In the setup menu, you can set topic name, rosbridge websocket port number,
and buffer size. All settings and host name are saved as cookie.

Other buttons are the same as rxconsole.

License
---------------------
new BSD License

Requirements
----------------
* Server: rosbridge (version 1.0/2.0)
* Client: Web browser with Websocket (Chrome/Firefox/Safari)

Documents (API)
----------------------
type `make' to generate javascript API documents.

here is generated document.

* http://otl.github.com/wxconsole/doc/

Libraries
---------------------
wxconsole uses these libraries.

* rosbridge (version 1.0 and 2.0) http://rosbridge.org
* twitterbootstrap http://twitter.github.com/bootstrap/
* jQuery http://jquery.com/

for documents.

* jsdoc toolkit http://code.google.com/p/jsdoc-toolkit/
* jsdoc bootstrap http://orgachem.github.com/JsDoc2-Template-Bootstrap/

for tests.
* QUnit http://docs.jquery.com/QUnit

Tests
------------------------
you can execute all tests in this url.

* http://otl.github.com/wxconsole/test/