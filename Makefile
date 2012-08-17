SOURCE=wxconsole.js

all: doc

doc: $(SOURCE)
	jsdoc -t=doc/jsdoc-bootstrap -d=doc $<
