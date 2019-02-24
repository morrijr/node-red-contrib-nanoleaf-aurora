# Nanoleaf Aurora Node-Red client #
A node-red module, which provides nodes to manipulate a Nanoleaf Aurora installation.

## Installation ##
To install the stable version use the `Menu - Manage palette` option and search for `node-red-contrib-nanoleaf-aurora`, or run the following command in your Node-RED user directory (typically `~/.node-red`):

    npm i node-red-contrib-nanoleaf-aurora

Open your Node-RED instance and you should have Nanoleaf Aurora nodes available in the palette.

## Get your access token ##
You can request an access token from the 'new access token' node. This is required for the other nodes to manipulate your installation.

To do so, create a flow with a inject input, new access token and debug output (or import the flow below).

    [{"id":"e55b9d45.fd9998","type":"inject","z":"2d92504.e175db","name":"Create","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":100,"wires":[["cb1b93ab.818018"]]},{"id":"1aa2ee85.d5cca9","type":"debug","z":"2d92504.e175db","name":"Debug token","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":510,"y":100,"wires":[]},{"id":"cb1b93ab.818018","type":"new-access-token","z":"2d92504.e175db","host":"","query":"/api/v1/new","port":16021,"x":290,"y":100,"wires":[["1aa2ee85.d5cca9"]]},{"id":"f5b63322.d94098","type":"comment","z":"2d92504.e175db","name":"Create new access token","info":"","x":130,"y":20,"wires":[]},{"id":"cd2b5206.2cd0e8","type":"comment","z":"2d92504.e175db","name":"Change host IP address!","info":"","x":310,"y":60,"wires":[]}]

Fill in the host ip of your Nanoleaf Aurora.  Deploy then hold the on-off button down for 5-7 seconds until the LED starts flashing.  Triggering the inject node should result in a new access token being created and displayed in the debug area.

Use this token when creating an installation of Nanoleaf Aurora for the other nodes.

## Current nodes implemented ##
* Brightness; set the current brightness. 
  * Integer payload; 0 -> 100. 
    - Numbers less than 0 are clipped to 0
    - Numbers greater than 100 clipped to 100
  * Object payload { brightness (0, 100], duration (seconds) }
* Color; support for hex (#RRGGBB), [css keyword](https://drafts.csswg.org/css-color/#named-colors)), RGB and HSV
* Effects; list installed effects, current effect or both
* Effect; set the current effect and start the show
* Identify; flash the Nanoleaf Aurora installation on and off (colour cannot be changed)
* Installation; shared configuration node used by all but the new access token node
* Information; dump of all the information supplied by the Nanoleaf Aurora installation
* New access token; create a new access token (see above)
* Power; switch on/off
* Power status; on/off
* Advanced; direct manipulation of the restful
  [API](https://forum.nanoleaf.me/docs/openapi) implemented by Nanoleaf.
  <em>DO NOT</em> use unless you know what you are doing! 

## Changes ahead ##
Nothing more planned! If you want something, please raise an issue or a pull request.

## Changelog ##

### 0.1.0 (2019.02.24)
- Migrated from original dependency [nanoleaf-aurora-client](https://github.com/darrent/nanoleaf-aurora-api/blob/master/README.md) which is no longer supported. Thanks guys, the code was appreciated!
- Moved all requests to direct calls using the axios library
- Brightness now supports, in addition to an 'immediate' brightness an object with a transition duration
- Power-status node can set the output payload as
  - String (default), 
  - Boolean or
  - Numeric
- Effects can set the output payload as 
  - Available; array of installed effects
  - Selected; currently selected effect
  - Combined; object with both selected and available effects
- Advanced node

### 0.0.5 (2019.02.22)
- Additional color options

### 0.0.4 (2019.02.02)
- Added color node [requested](https://github.com/morrijr/node-red-contrib-nanoleaf-aurora/issues/1) by arrichter

### 0.0.3 (2018.08.12)
- Added brightness node

### 0.0.2 (2018.08.09)
- Added README.md

### 0.0.1 (2018.08.08)
- Initial release
