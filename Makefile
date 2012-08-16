SOURCE=wxconsole.js

all: doc

doc: $(SOURCE)
	jsdoc -d=doc $<
