# How to change colors

The colors in the file blue.less are in HTML color codes (http://html-color-codes.info/). 
To change the colors in Galaxy, change the color numbers, and then follow this README to
see changes in the galaxy. (https://github.com/galaxyproject/galaxy/tree/dev/client)

Or, follow these steps


NOTE: $GALAXY_ROOT , this is going to be your base galaxy directory for the whole app.

Steps:

  - Make changes you want to make in ```blue.less``` or any other ```.less``` file to change color or font.

The CSS and styling used by Galaxy is also controlled from this directory. Galaxy uses LESS, a superset of CSS that compiles to CSS, for its styling. LESS files are kept in ```client/galaxy/style/less```. 

  - Install "grunt" on your machine using the command given below:

```npm install -g grunt grunt-cli```

  - In your client, directory i.e change directory to $GALAXY_ROOT/client, install "npm" with this command:

```npm install```

  - Run ```grunt``` on the the client folder, if it runs without errors you are good to go. When you restart galaxy,
you should be able to see the changes.
