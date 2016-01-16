
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
		if(status == "closed")
		{
			ros = new ROSLIB.Ros 
			({ 
				url : 'ws://'+ip
			});
			ros.on('connection', function() 
			{
			console.log('Connected to websocket server.');
			status='connected';
			converse(status);
	  		});

	  		ros.on('error', function(error) {
			console.log('Error connecting to websocket server: ', error);
			converse(status);
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
	  + result.sum);function init()
  {

	var ros = new ROSLIB.Ros({
		url : 'ws://localhost:9090'
	  });

	  ros.on('connection', function() {
		console.log('Connected to websocket server.');
	  });

	  ros.on('error', function(error) {
		console.log('Error connecting to websocket server: ', error);
	  });

	  ros.on('close', function() {
		console.log('Connection to websocket server closed.');
	  });

  }
  });

  // Getting and setting a param value
  // ---------------------------------

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
