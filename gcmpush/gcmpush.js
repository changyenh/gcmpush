/**
 * Copyright 2014, 2016 IBM Corp.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
var RED = require(process.env.NODE_RED_HOME + "/red/red");
//creds
var SENDER_ID = "917341916938";
var SERVER_API_KEY = "AIzaSyC18n2hwjZVoXjq_BLi1Z0tGBhPXjpE3dw";
var request = require('request');

//
// HTTP endpoints that will be accessed from the HTML file
//


function GCMPushNode(n) {

	RED.nodes.createNode(this, n);

	// get the identifiers for tags/deviceids
	this.notificationType = n.notification;
	if (typeof n.identifiers !== 'undefined') {
	    // variable is defined
	    this.identifiers = n.identifiers;
	} else {
		this.identifiers = null;
	}
	console.log('id:' + this.identifiers);

	this.on("input", function(msg) {

		var alert = msg.payload;
		alert = alert.toString();

		if (typeof msg.identifiers !== 'undefined' && msg.identifiers != null) {
			this.identifiers = msg.identifiers;
		}
		ids = this.identifiers.split(',');
		//remove the whitespaces for each value.
		//idArr = [];
		for(var i=0;i<ids.length;i++) {
			ids[i] = ids[i].trim();
		}
		console.log('ids:' + ids);
		var message = msg.payload;

		switch (this.notificationType) {
			case "global":
				invokePush(message,this,"/topics/global");
				break;
			case "deviceid":
				invokePush(message,this,this.identifiers);
				break;
			default:
				console.log("Invalid option. Please retry");
				return null;
		}

	});
}

RED.nodes.registerType("gcmpush", GCMPushNode);

//util function for Mobile Push ReST calls

function invokePush (message, node, identifiers) {
	var options = {
	  url: 'https://gcm-http.googleapis.com/gcm/send',
	  headers: {
	    'Content-Type': 'application/json',
	    'Authorization': 'key=' + SERVER_API_KEY//'key=AIzaSyC18n2hwjZVoXjq_BLi1Z0tGBhPXjpE3dw'
	  },
	  method : 'POST',
	  json : true,
	  body : {
	    "data": message,
	    "to": identifiers
	  }
	};
	console.log(options);
	 
	function callback(error, response, body) {
	  if (!error && response.statusCode == 202) {
	    node.status({fill:"blue",shape:"dot",text:"Sent"});
	    node.status({});
	    
	  } else {
	  	node.error(response.statusCode +" : "+body.message);
	  	node.status({fill:"red",shape:"dot",text:"Error: "+response.statusCode+" : "+body.message});
	  }
	}
	 
	request(options, callback);
	node.status({fill:"blue",shape:"dot",text:"Sending"});
}
