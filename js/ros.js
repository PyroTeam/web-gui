// Connecting to ROS
// -----------------
function connect(secure, Ros)
{
	var ip = document.getElementById('ip').value;
	console.log('ip=' + ip);
	converse('ip=' + ip);

			if(secure == true)
			{
				Ros.connect('wss://'+ip);
			}
			else
			{
				Ros.connect('ws://'+ip);
			}

			Ros.on('connection', function()
			{
			console.log('Connected to websocket server.');
			status='Connected';
			converse(status);
			});

			Ros.on('error', function(error) {
			console.log('Error connecting to websocket server: ', error);
			converse("Error");
			});

			Ros.on('close', function() {
			console.log('Connection to websocket server closed.');
			status="Closed";
			converse(status);
			});

			//return Ros;



		/*else
		{
			console.log('Already connected');
			converse('Already connected');
		}*/

}


// Publishing a Topic
// ------------------

function publisher(Name, MsgType, Message, Ros)
{
	var x;
	clearInterval(x);
	if (Ros != '')
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
	x = setInterval("console.log(\""+Name+"\")", 500);

}

// Subscribing to a Topic for an instant
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

function liveSpaceSubscriber(NameRobot, TopicName, MessageType, Ros)
{
	var topic = new ROSLIB.Topic({
		ros :Ros,
		name : TopicName,
		messageType : MessageType
	});

	topic.subscribe(function(message)
	{
		console.log('received message on ' + topic.name + ': ');
		console.log(message);
		topic.unsubscribe();
		var data='';
		for (var key in message)
		{
			data += key +'<span class="' + key +'" ></span><br>';
		}
		console.log(data);

		var id = NameRobot+"-"+TopicName;
		console.log(id);
		id = id.replace('_','-');
		id = id.replace('/','-');
		id = id.replace('/','-');
		console.log(id);
		$('#Ltabs-1').append("<fieldset class="+id+"><legend>" + NameRobot + " " + TopicName +"</legend>"+data+"</fieldset>");

		for (var key in message)
		{
			/*console.log("message:");
			console.log(message);
			console.log("msg key");
			console.log(message[key]);
			console.log("key");
			console.log(key);*/
			genSpanInfoFromObject(message[key],key,NameRobot,TopicName);
		}
		getLiveInfo(NameRobot,TopicName);
	});
}

//permanent subscribe
function pSubscriber(NameRobot, TopicName, MessageType, def, Ros)
{
	var selector = NameRobot+TopicName
	var topic = new ROSLIB.Topic({
		ros :Ros,
		name : TopicName,
		messageType : MessageType
	});

	topic.subscribe(function(message)
	{
		var type = new Array;
		var i=0;
		for (var key in def)
		{
			type[i] = (def[key].fieldtypes);
			i++;
		}
		//console.log(message);
		for (var key in message)
		{
			//console.log(message[key]);

		}
		genInfoFromObject(message,type,NameRobot,TopicName);
	});
}

// Calling a service
// -----------------

function getSrvRequestDetails(srvType, Ros, callback)
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

function getSrvResponseDetails(srvType, Ros, callback)
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
		getSrvResponseDetails(type, Ros, function(response)
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

function strtok(word, delim)
{

	delim_escaped = new RegExp('[' + delim.replace(/[\[\]\(\)\*\+\?\.\\\^\$\|\#\-\{\}\/]/g, "\\$&") + ']', 'g');
	//return word.replace(delim_escaped, delim[0]).split(delim[0]);
	return word.split(delim_escaped);
}