// Connecting to ROS
// -----------------



function strtok(src, delim)
{
	elim_escaped = new RegExp('[' + delim.replace(/[\[\]\(\)\*\+\?\.\\\^\$\|\#\-\{\}\/]/g, "\\$&") + ']', 'g');
  	return src.replace(delim_escaped, delim[0]).split(delim[0]);
}


function connect()
{
	var ip = document.getElementById('ip').value;

	console.log('ip=' + ip);
	converse('ip=' + ip);
		if(status == "Closed")
		{
			ros = new ROSLIB.Ros 
			({ 
				url : 'ws://'+ip
			});
			ros.on('connection', function() 
			{
			console.log('Connected to websocket server.');
			status='Connected';
			converse(status);
	  		});

	  		ros.on('error', function(error) {
			console.log('Error connecting to websocket server: ', error);
			converse("Error");
	  		});

	  		ros.on('close', function() {
			console.log('Connection to websocket server closed.');
			status="Closed";
			converse(status);
	  		});
		}

	else 
		{
			console.log('Already connected');
			converse('Already connected');
		}

}

function init()
{
	//ros = a robot
	ros = new ROSLIB.Ros 
	({ 
		url : 'ws://127.0.0.1:9090'
	});


	ros.on('connection', function() {
	console.log('Connected to websocket server.');
	status='connected';
	});

	ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);
	});

	ros.on('Closed', function() {
	console.log('Connection to websocket server Closed.');
	status="Closed";
	});

}



// Publishing a Topic
// ------------------

function publisher(Name, MsgType, Message)
{
	if (ros != '')
		console.log('ros existe');
	else console.log("ros n'existe pas");
	var topic = new ROSLIB.Topic
	({
		ros : ros,
		name : Name,
		messageType : MsgType 
	});

	topic.publish(Message);
	console.log('type ' + MsgType);
	console.log('message ' + Message);

}

  /*var cmdVel = new ROSLIB.Topic({
	ros : ros,
	name : '/cmd_vel',
	messageType : 'geometry_msgs/Twist'
  });

  var twist = new ROSLIB.Message({
	linear : {
	  x : 0.1,
	  y : 0.2,
	  z : 0.3
	},
	angular : {
	  x : -0.1,
	  y : -0.2,
	  z : -0.3
	}
  });
  cmdVel.publish(twist);*/

  // Subscribing to a Topic
  // ----------------------

function subscriber(TopicName, MessageType)
{
	var topic = new ROSLIB.Topic({
		ros :ros,
		name : TopicName,
		messageType : MessageType
	});

	topic.subscribe(function(message) 
	{
	  	console.log('received message on ' + topic.name + ': ' + message);
	  	console.log(message);
	  	var data='';
	  	for (var key in message) 
	  	{

	    	data += key +' ' + message[key]+'; ';
		}
		converse(data);
	  	topic.unsubscribe();
	});
}

	/*var listener = new ROSLIB.Topic({
	ros : ros,
	name : '/listener',
	messageType : 'std_msgs/String'
	});

	listener.subscribe(function(message) {
	console.log('Received message on ' + listener.name + ': ' + message.data);
	listener.unsubscribe();
	});*/

	// Calling a service
	// -----------------

	function getSrvRequestDetails(srvType,callback)
	{
		var serviceRequestInfo = new ROSLIB.Service(
		{
			ros : ros,
			name : '/rosapi/service_request_details',
			type : 'rosapi/ServiceRequestDetails'
		});

		var request = new ROSLIB.ServiceRequest(
		{
			type : srvType
		});

		serviceRequestInfo.callService(request, function(result)
		{
			console.log(result);
			console.log(result.typedefs)
			if (typeof callback === 'function') 
			{
				callback(result.typedefs);
			};
		});

	}

	function getSrvResponseDetails(srvType,callback)
	{
		var serviceResponseInfo = new ROSLIB.Service(
		{
			ros : ros,
			name : '/rosapi/service_response_details',
			type : 'rosapi/ServiceResponseDetails'
		});

		var request = new ROSLIB.ServiceRequest(
		{
			type : srvType
		});

		serviceResponseInfo.callService(request, function(result)
		{
			callback(result.typedefs);
		});

	}

	function callSrv(srvName,srvType,srvRequest)
	{
		var service = new ROSLIB.Service(
		{
			ros : ros,
			name : srvName,
			type : srvType
		});
		
		service.callService(srvRequest, function(result)
		{
			getSrvResponseDetails(type,function(response)
			{
				var typedef = ros.decodeTypeDefs(response);
				console.log(result);
				console.log(typedef);
				genFromObject(result);
			});
		});
	}

	/*var addTwoIntsClient = new ROSLIB.Service({
	ros : ros,
	name : '/add_two_ints',
	serviceType : 'rospy_tutorials/AddTwoInts'
	});

	var request = new ROSLIB.ServiceRequest({
	a : 1,
	b : 2
	});

	addTwoIntsClient.callService(request, function(result) {
	console.log('Result for service call on '
	  + addTwoIntsClient.name
	  + ': '
	  + result.sum);
	});*/

	function createParam(paramName,value)
	{
		var param = new ROSLIB.Param(
		{
			ros : ros,
			name : paramName
		});
		if(value !== undefined && value !="")
		{
			param.set(value);
			converse("création de "+paramName);
		}
		return param;
	}

	function setParam(paramName,value)
	{
		var paramsClient = new ROSLIB.Service({
			ros : ros,
			name : '/rosapi/set_param',
			serviceType : 'rosapi/SetParam'
		});

		var request = new ROSLIB.ServiceRequest(
		{
			name : paramName,
			value : value
		});


	 	paramsClient.callService(request);
		converse("mise à jour de "+paramName+" à "+value);

	}

	function getParam(paramName) 
	{
		var paramsClient = new ROSLIB.Service({
			ros : ros,
			name : '/rosapi/get_param',
			serviceType : 'rosapi/GetParam'

		});

		var request = new ROSLIB.ServiceRequest(
		{
			name : paramName
		});


	 	paramsClient.callService(request, function(result) 
	 	{
	    	converse("value of "+paramName+" : "+result.value);
	    	paramValue=result.value;
	 	});

	}

	function test()
	{


	}
	
	// Getting and setting a param value
	// ---------------------------------
	/*
	ros.getParams(function(params) {
	console.log(params);
	});

	var maxVelX = new ROSLIB.Param({
	ros : ros,
	name : 'max_vel_y'
	});

	maxVelX.set(0.8);
	maxVelX.get(function(value) {
	console.log('MAX VAL: ' + value);
	});*/
