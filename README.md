gcmpush
========================
Sends push notifications to mobile devices in [Node-RED](http://nodered.org) using GCM Push Notification for Bluemix Node-Red

Usage
-----
	
`msg.payload` is used as the alert in the Notification.

**Mobile Push Properties**

*Application Mode* - Select the mode of operation for the IBM Push Notification. You can override this property by providing ```msg.mode```

*Application ID and Secret* - mandatory only when used in *non-Bluemix environment* and must be copied from the IBM Push Notification service in Bluemix. If used in *Bluemix environment*, these properties will be automatically read and these properties are not displayed in the configuration screen.

**Notification Type**

Type of notification to be pushed.

- Broadcast - Send notifications to all the registered devices
- By DeviceIds - Send notifications to devices by their device ID. Can take multiple values seperated by comma(,)

*Notification Identifiers* - Used when notifications are sent *By Tags and By DeviceIds*. This can take multiple values seperated by comma(,). Example: GoldCoupons,SilverCoupons
