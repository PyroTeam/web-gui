//lecture du formulaire

var ros ='';
var status ='Closed';

function converse(message)
{
  var maj = document.getElementById("conversation").innerHTML;
  maj += '<br>' + message;
  document.getElementById("conversation").innerHTML = maj;
}

function genFromForm()
{
	var i = 1,j = 0;
	var floatType = ["float64","float32"];
	var intType = ["uint8","uint16","uint32","uint64"];
	if (document.getElementById(i).innerHTML == '' && i == 1)
		{
			while (document.getElementById(i) != null)
			{
				if ((document.getElementById(i).placeholder.indexOf("float") >= 0) && floatType.indexOf(document.getElementById(i).placeholder) != -1)
					typedef[document.getElementById(i).name]=parseFloat(document.getElementById(i).value);
				if ((document.getElementById(i).placeholder.indexOf("int") >= 0) && intType.indexOf(document.getElementById(i).placeholder) != -1)
					typedef[document.getElementById(i).name]=parseInt(document.getElementById(i).value);
				if (document.getElementById(i).placeholder == "string")
					typedef[document.getElementById(i).name]=document.getElementById(i).value.toString();
				i++
			}
		}
		else
		{
			while (document.getElementById(i) != null)
			{
				
				if  (document.getElementById(i).innerHTML != '') 
				{
					if (i != 1)
						j++;
					navigateur[j] = document.getElementById(i).innerHTML;

				}
				else
				{
					if (floatType.indexOf(document.getElementById(i).placeholder) != -1)
						typedef[document.getElementById(i).name]=parseFloat(document.getElementById(i).value);
					if (intType.indexOf(document.getElementById(i).placeholder) != -1)
						typedef[document.getElementById(i).name]=parseInt(document.getElementById(i).value);
					if (document.getElementById(i).placeholder == "string")
						typedef[document.getElementById(i).name]=document.getElementById(i).value.toString();
				}
				i++;
			}
		}
}

function genFromObject(object)
{
	for (var key in object) 
	{
		if (typeof object[key] === 'object')
		{
			//converse("name:"+key+" typeof:"+typeof object[key]);
			//converse(key+"\n");
			recursive_key(object[key],iteration++,'');
		}
		else 
		{
			//converse("name:"+key+" name:"+object[key]+" iteration:"+iteration);
			converse(key +" "+ object[key]+"\n");
		}
	}
}

function conf(ech1)
{
	var navigateur = new Array;
	
	
	//navigateur[1] = document.getElementById('2').name;
	//var test_def = typedef[navigateur[0]];
	console.log('wait');

	if (action == "topicPublisher")
	{
		var type = document.getElementById('0').innerHTML;
		var i = 1,j = 0;
		genFromForm();
		
		var message = new ROSLIB.Message;
		message = typedef;
		publisher(ech1,type,message);
	}

	if (action == "serviceCall") 
	{
		ros.getServiceType(ech1,function(serviceTypes)
		{
			
			var type = document.getElementById('0').innerHTML;
			genFromForm();
			var request = new ROSLIB.ServiceRequest;
			request = typedef;
			callSrv(ech1,type,request);
		});
	};
}

var id_echange_interactif = 0;

function recursive_key(object, iteration,formulaire)
{
	if (formulaire != '')
	{
		formulaire = "<p id='"+id_echange_interactif+"'>"+formulaire+"</p>";
		document.getElementById('echange_interactif').innerHTML = formulaire;
	}
	for (var key in object) 
	{

		id_echange_interactif++
		//converse("name:"+key+" typeof:"+typeof object[key]);
		if (typeof object[key] === 'object')
		{
			//converse("name:"+key+" typeof:"+typeof object[key]);
			formulaire = "<p id='"+id_echange_interactif+"'>"+key+"</p>";
			document.getElementById('echange_interactif').innerHTML += formulaire;
			recursive_key(object[key],iteration++,'');
		}
		else 
		{
			//converse("name:"+key+" name:"+object[key]+" iteration:"+iteration);
			formulaire = key+" <input type=\"text\" id='"+id_echange_interactif+"'name=\""+key+"\" value=\"\" placeholder=\""+object[key]+"\"size=\"15\">";
			document.getElementById('echange_interactif').innerHTML += formulaire;
		}
	}
}



function lecture()
{
	var ech1 = document.getElementById('echange1').value;
	var ech2 = document.getElementById('echange2').value;
	//var ech3 = document.getElementById('echange3').value;
	console.log('lecture '+action);
	if (action == "test")
	{
		//converse(ech3);
		ros.getTopicType(ech3,function(topicTypes)
		{
			//converse('types:'+topicTypes+'<br>');
			type = topicTypes;
			ros.getMessageDetails(type,function(getMessageDetails)
			{
				def = getMessageDetails;
				typedef = ros.decodeTypeDefs(def);
				document.getElementById('echange_interactif').innerHTML = "";
				recursive_key(typedef,0,type);
				id_echange_interactif = 0;
			});
		});
		
	}
	if (action == "topicPublisher")
	{
		converse(ech1);
		ros.getTopicType(ech1,function(topicTypes)
		{
			type = topicTypes;
			ros.getMessageDetails(type,function(getMessageDetails)
			{
				def = getMessageDetails;
				typedef = ros.decodeTypeDefs(def);
				document.getElementById('echange_interactif').innerHTML = "";
				recursive_key(typedef,0,type);
				document.getElementById('echange_interactif').innerHTML += '<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button>';
				id_echange_interactif = 0;
				
			});
		});
		
		
	}

	if (action == "topicSubscriber")
	{
		ros.getTopicType(ech1,function(topicTypes)
		{
			type = topicTypes;
			subscriber(ech1,type);
		});
	}

	if (action == "serviceCall")
	{
		converse(ech1);
		ros.getServiceType(ech1,function(serviceTypes)
		{
			type = serviceTypes;
			getSrvRequestDetails(type,function(getSrvRequestDetails)
			{
				req = getSrvRequestDetails
				typedef = ros.decodeTypeDefs(req);
				document.getElementById('echange_interactif').innerHTML = "";
				recursive_key(typedef,0,type);
				document.getElementById('echange_interactif').innerHTML += '<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button>';
				id_echange_interactif = 0;
			});
		});

	}

	if (action == "paramSetGet")
	{
		ros.getParams(function(params)
		{
			if (ech1 !== undefined && ech1!="")
			{
				if (params.indexOf(ech1) == -1)
				{
					var param = createParam(ech1,ech2);
				}
				else if (ech2 !== undefined && ech2 !="")
				{
					setParam(ech1,ech2);
				}
				else
				{
					var paramValue;
					getParam(ech1);
				}
			}
				
		})				

	}
	
}	

function function_test()
{
	test();
}



//Formulaire dynamique

var topicPublisher = new Array;
topicPublisher[0] = "Topic name to publish";
topicPublisher[1] = "Nothing here";
topicPublisher[2] = "Nothing here";

var topicSubscriber = new Array;
topicSubscriber[0] = "Topic name to subscribe";
topicSubscriber[1] = "Nothing here";
topicSubscriber[2] = "Nothing here";

var serviceCall = new Array;
serviceCall[0] = "Name of service";
serviceCall[1] = "Type of service";
serviceCall[2] = "Nothing here";

var paramSetGet = new Array;
paramSetGet[0] = "Name of param";
paramSetGet[1] = "If setting, value";


var action="";

function Lien_action() 
{
	document.getElementById("echange1").className = "";
	document.getElementById("echange2").className = "";
	document.getElementById("echange1").removeAttribute("autocomplete");
	document.getElementById("echange2").removeAttribute("autocomplete");
	removeAC("echange1");
	i = document.getElementById("Liste").selectedIndex;
	if (i == 0)
	{
		document.getElementById("echange1").placeholder = '';
		document.getElementById("echange2").placeholder = '';
		//document.getElementById("echange3").placeholder = '';
	}
	else if (i == 4)
	{
		action=document.getElementById("Liste").options[i].value;
		console.log(action);

	}
	else
	{
		action=document.getElementById("Liste").options[i].value;
		console.log(action);
		document.getElementById("echange1").placeholder = window[document.getElementById("Liste").options[i].value][0];
		document.getElementById("echange2").placeholder = window[document.getElementById("Liste").options[i].value][1];
		//document.getElementById("echange3").placeholder = window[document.getElementById("Liste").options[i].value][2];
		if (i==1 || i == 2)
		{
			ros.getTopics(function(topics)
			{
				document.getElementById("echange1").className = "ui-autocomplete-input";
				autoComplete('echange1',topics);
			});	
		}
		if (i==3) 
		{
			ros.getServices(function(services)
			{
				document.getElementById("echange1").className = "ui-autocomplete-input";
				autoComplete('echange1',services);
			})
		}
		if (i==5) 
		{
			ros.getParams(function(params)
			{
				document.getElementById("echange1").className = "ui-autocomplete-input";
				autoComplete('echange1',params);
			})
		}
	}	
}




function autoComplete(inputId,array)
{
	jQuery(function ($)
	{
		var id = "#"+inputId;
		$( id ).autocomplete({source:array});
	});
}	

function removeAC(inputId)
{
	jQuery(function ($)
	{
		var id = "#"+inputId;
		var vide = new Array;
		$( id ).autocomplete({source: vide});
	});
}
