// Connecting to ROS
// -----------------



function connect(secure)
{
	var ip = document.getElementById('ip').value;

	//console.log('ip=' + ip);
	converse('ip=' + ip);
		if(status == "Closed")
		{
			if(secure == true)
			{
				ros = new ROSLIB.Ros 
				({ 
					url : 'wss://'+ip
				});
			}
			else 
			{
				ros = new ROSLIB.Ros 
				({ 
					url : 'ws://'+ip
				});
			}
			
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
	  		return ros;
		}


		/*else 
		{
			console.log('Already connected');
			converse('Already connected');
		}*/

}

/*function init()
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

}*/



// Publishing a Topic
// ------------------

function publisher(Name, MsgType, Message, Ros)
{
	if (ros != '')
		console.log('ros existe');
	else console.log("ros n'existe pas");
	var topic = new ROSLIB.Topic
	({
		ros : Ros,
		name : Name,
		messageType : MsgType 
	});

	topic.publish(Message);
	console.log('type ' + MsgType);
	console.log('message ' + Message);

}

  // Subscribing to a Topic
  // ----------------------

function subscriber(TopicName, MessageType, Ros)
{
	var topic = new ROSLIB.Topic({
		ros :Ros,
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

	// Calling a service
	// -----------------

	function getSrvRequestDetails(srvType, callback, Ros)
	{
		var serviceRequestInfo = new ROSLIB.Service(
		{
			ros : Ros,
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

	function getSrvResponseDetails(srvType, callback, Ros)
	{
		var serviceResponseInfo = new ROSLIB.Service(
		{
			ros : Ros,
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

	function callSrv(srvName,srvType,srvRequest, Ros)
	{
		var service = new ROSLIB.Service(
		{
			ros : Ros,
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

	//set, get or change a param

	function createParam(paramName, value, Ros)
	{
		var param = new ROSLIB.Param(
		{
			ros : Ros,
			name : paramName
		});
		if(value !== undefined && value !="")
		{
			param.set(value);
			converse("création de "+paramName);
		}
		return param;
	}

	function setParam(paramName, value, Ros)
	{
		var paramsClient = new ROSLIB.Service({
			ros : Ros,
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

	function getParam(paramName, Ros) 
	{
		var paramsClient = new ROSLIB.Service({
			ros : Ros,
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




function strtok(src, delim)
{
	elim_escaped = new RegExp('[' + delim.replace(/[\[\]\(\)\*\+\?\.\\\^\$\|\#\-\{\}\/]/g, "\\$&") + ']', 'g');
  	return src.replace(delim_escaped, delim[0]).split(delim[0]);
}