

function getLiveInfo(NameRobot,TopicName)
{
	var Ros = rosArray[NameRobot];
	Ros.getTopicType(TopicName,function(topicTypes)
	{
		type = topicTypes;
		Ros.getMessageDetails(type,function(getMessageDetails)
		{
			def = getMessageDetails;
			typedef = Ros.decodeTypeDefs(def);

			pSubscriber(NameRobot,TopicName,type, def, Ros);
		});
	});
}

function createLiveSpace(NameRobot,TopicName)
{
	var Ros = rosArray[NameRobot];
	Ros.getTopicType(TopicName,function(topicTypes)
	{
		type = topicTypes;
		liveSpaceSubscriber(NameRobot, TopicName, type, Ros);
	});
}

function genInfoFromObject(message,type,NameRobot,TopicName)
{
	var id = NameRobot+"-"+TopicName;
	id = id.replace('_','-');
	var numericType = ["float64","float32","float16","uint8","uint16","uint32","uint64"];
	var i=0;
	//console.log(type);
	for (var key in message)
	{
		if(typeof message[key] === 'object')
			genInfoFromObject(message[key],type);
		else
		{
			if(numericType.indexOf(type[i]))
			{
				$('#Ltabs-1 .'+id+' .'+key).html('['+Number(message[key]).toFixed(2)+']');
			}
			else
				$('#Ltabs-1 .'+id+' .'+key).html('['+message[key]+']');

			i++;
		}

	}
}

function genSpanInfoFromObject(message,dir,NameRobot,TopicName)
{
	var id = "."+NameRobot+"-"+TopicName;
	id = id.replace('_','-');
	id = id.replace('/','-');
	id = id.replace('/','-');
	var fieldElement = document.getElementById('Ltabs-1');
	console.log(fieldElement);
	id = id.toString();
	console.log(id);
	console.log(fieldElement.querySelector(id));
	//fieldElement = fieldElement.getElementById('#Ltabs-1 #' + NameRobot + '_' + TopicName);
	for (var key in message)
	{
		/*console.log("get msg");
		console.log(message);
		console.log("get key");
		console.log(key);*/
		if(typeof message === 'object')
		{
			$(id).html($('#Ltabs-1 '+id+' .'+dir).html()+" "+key +'<span class="' + key +'" ></span>');
			genSpanInfoFromObject(message[key],key);
		}
		else
		$(id).html($('#Ltabs-1 '+id+' .'+dir).html()+key +'<span class="' + key +'" ></span>');






		/*data += key +'<span class="' + key +'" >[]</span><br>';
		console.log(message);
		console.log(key);
		console.log(data);
		if(typeof message[key] === 'object')
		{
			genSpanInfoFromObject(message[key],data);
		}*/
	}
}