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
and buffer size.

Other buttons are the same as rxconsole.

Filtering is not implemented yet.

License
---------------------
new BSD License

Requirements
----------------
* Server: rosbridge (version 1.0 or 2.0)
* Client: web browser (Chrome/Firefox/Safari)

Libraries
---------------------
wxconsole uses these libraries.

* rosbridge (version 1.0 and 2.0) http://rosbridge.org
* twitterbootstrap http://twitter.github.com/bootstrap/
* jQuery http://jquery.com/
