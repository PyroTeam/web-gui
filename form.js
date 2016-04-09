//lecture du formulaire
var id_echange_interactif = 0;
var status ='Closed';
var ech1='',ech2='';

var form='';
var element = '<fieldset><legend>Formulaire interactif</legend> <form name="echange_interactif" action="#" method="post">';

var rosArray = new Array;
var ROSLIBArray = new Array;
var activeRos;
var activeRosName;
var rosElement; 

/*function ROS(ROSLIB,)
{
	this.ROSLIB = ROSLIB;
	this.ros = ROSLIB.ros;
}*/


//publie un message dans le chat

function converse(message) 
{
	//var maj = document.getElementById("conversation").innerHTML;
	var maj = $('.tab.active #conversation').html();
	maj += '<br>' + message;
	//document.getElementById("conversation").innerHTML = maj;
	$('.tab.active #conversation').html(maj);
} 

// rempli un objet défini mais vide à partir d'un formulaire
function genFromForm(typedef)  
{
	var navigateur = new Array;
	var i = 1,j = 0;
	var floatType = ["float64","float32"];
	var intType = ["uint8","uint16","uint32","uint64"];
	if (rosElement.querySelector(i).innerHTML == '' && i == 1) //seulement une ligne d'input
	{
		while (rosElement.querySelector(i) != null)
		{
			if ((rosElement.querySelector(i).placeholder.indexOf("float") >= 0) && floatType.indexOf(rosElement.querySelector(i).placeholder) != -1)
				typedef[rosElement.querySelector(i).name]=parseFloat(rosElement.querySelector(i).value);
			if ((rosElement.querySelector(i).placeholder.indexOf("int") >= 0) && intType.indexOf(rosElement.querySelector(i).placeholder) != -1)
				typedef[rosElement.querySelector(i).name]=parseInt(rosElement.querySelector(i).value);
			if (rosElement.querySelector(i).placeholder == "string")
				typedef[rosElement.querySelector(i).name]=rosElement.querySelector(i).value.toString();
			i++
		}
	}
	else //objet complexe
	{
		while (rosElement.querySelector(i) != null)
		{
			
			if  (rosElement.querySelector(i).innerHTML != '') 
			{
				if (i != 1)
					j++;
				navigateur[j] = rosElement.querySelector(i).innerHTML;
			}
			else
			{
				if ((rosElement.querySelector(i).placeholder.indexOf("float") >= 0) && floatType.indexOf(rosElement.querySelector(i).placeholder) != -1)
					typedef[navigateur[j]][rosElement.querySelector(i).name]=parseFloat(rosElement.querySelector(i).value);
				if ((rosElement.querySelector(i).placeholder.indexOf("int") >= 0) && intType.indexOf(rosElement.querySelector(i).placeholder) != -1)
					typedef[navigateur[j]][rosElement.querySelector(i).name]=parseInt(rosElement.querySelector(i).value);
				if (rosElement.querySelector(i).placeholder == "string")
					typedef[navigateur[j]][rosElement.querySelector(i).name]=rosElement.querySelector(i).value.toString();
			}
			i++;
		}
	}
	return typedef;	
}

//lis un objet complexe et l'affiche via converse
function genFromObject(object) 
{
	console.log("gen"+object);
	console.log("gen value"+object.value);
	console.log("gen string"+toString(object));
	for (var key in object) 
	{
		if (typeof object[key] === 'object')
		{
			converse("name:"+key+" typeof:"+typeof object[key]);
			converse(key+"\n");
			genFromObject(object[key]);
		}
		else 
		{
			//converse("name:"+key+" name:"+object[key]+" iteration:"+iteration);
			converse(key +" "+ object[key]+"\n");
		}
	}
}

//est appelé par le bouton confirmer du formulaire interactif
function conf(ech1)
{
	var Ros = activeRos;
	if (action == "topicPublisher")
	{
		var type = rosElement.querySelector('#0').innerHTML;
		//var i = 1,j = 0;
		typedef = genFromForm(typedef);
		
		var message = new ROSLIB.Message;
		message = typedef;
		publisher(ech1,type,message,Ros);
	}

	if (action == "serviceCall") 
	{
		Ros.getServiceType(ech1,function(serviceTypes)
		{
			
			var type = rosElement.querySelector('#0').innerHTML;
			if(rosElement.querySelector('#1') != null)  
			{
				typedef = genFromForm(typedef); //verifier l'existence d'1 input
			}
			var request = new ROSLIB.ServiceRequest;
			request = typedef;
			callSrv(ech1,type,request,activeRos);
		});
	};
}

//génère un formulaire interactif à partir d'un object 
function recursive_key(object, iteration,formulaire)
{
	if (formulaire != '')
	{
		formulaire = "<p id='"+id_echange_interactif+"'>"+formulaire+"</p>";
		//document.getElementById('echange_interactif').innerHTML = formulaire;
		form = formulaire;
	}
	for (var key in object) 
	{

		id_echange_interactif++
		//converse("name:"+key+" typeof:"+typeof object[key]);
		if (typeof object[key] === 'object')
		{
			//converse("name:"+key+" typeof:"+typeof object[key]);
			formulaire = "<p id='"+id_echange_interactif+"'>"+key+"</p>";
			//document.getElementById('echange_interactif').innerHTML += formulaire;
			form += formulaire;
			recursive_key(object[key],iteration++,'');
		}
		else 
		{
			//converse("name:"+key+" name:"+object[key]+" iteration:"+iteration);
			formulaire = key+" <input type=\"text\" id='"+id_echange_interactif+"'name=\""+key+"\" value=\"\" placeholder=\""+object[key]+"\"size=\"15\">";
			form += formulaire;
			//document.getElementById('echange_interactif').innerHTML += formulaire;
		}
	}
}


//A_ => action
function A_topicPublisher(ech1,ech2,Ros)
{

	converse(ech1);
	Ros.getTopicType(ech1,function(topicTypes)
	{
		type = topicTypes;
		Ros.getMessageDetails(type,function(getMessageDetails)
		{
			def = getMessageDetails;
			typedef = Ros.decodeTypeDefs(def);
			form='';
			//document.getElementById('echange_interactif').innerHTML = "";
			recursive_key(typedef,0,type);
			//$('#echange_interactif').empty();
			//$('#echange_interactif').append(element + form+'<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button></form></fieldset>');
			rosElement.querySelector('#echange_interactif').empty();
			rosElement.querySelector('#echange_interactif').append(element + form+'<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button></form></fieldset>');
			//document.getElementById('echange_interactif').innerHTML += '<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button>';
			id_echange_interactif = 0;
			
		});
	});
}

function A_topicSubscriber(ech1,ech2,Ros)
{
	Ros.getTopicType(ech1,function(topicTypes)
	{
		type = topicTypes;
		subscriber(ech1,type,Ros);
	});
}

function A_serviceCall(ech1,ech2,Ros)
{
	converse(ech1);
	Ros.getServiceType(ech1,function(serviceTypes)
	{
		type = serviceTypes;
		getSrvRequestDetails(type,function(getSrvRequestDetails)
		{
			req = getSrvRequestDetails
			typedef = Ros.decodeTypeDefs(req);
			//document.getElementById('echange_interactif').innerHTML = "";
			form='';
			recursive_key(typedef,0,type);
			$('#echange_interactif').empty();
			$('#echange_interactif').append(element + form+'<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button></form></fieldset>');
			//document.getElementById('echange_interactif').innerHTML += '<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button>';
			id_echange_interactif = 0;
		});
	});
}

function A_paramSetGet(ech1,ech2,Ros)
{
	Ros.getParams(function(params)
	{
		if (ech1 !== undefined && ech1!="")
		{
			if (params.indexOf(ech1) == -1)
			{
				var param = createParam(ech1,ech2,Ros);
			}
			else if (ech2 !== undefined && ech2 !="")
			{
				setParam(ech1,ech2,Ros);
			}
			else
			{
				var paramValue;
				getParam(ech1,Ros);
			}
		}
			
	});				
}

function A_test(ech1,ech2,Ros)
{
	Ros.getTopicType(ech1,function(topicTypes)
	{
		type = topicTypes;
		Ros.getMessageDetails(type,function(getMessageDetails)
		{
			def = getMessageDetails;
			typedef = Ros.decodeTypeDefs(def);
			rosElement.querySelector('echange_interactif').innerHTML = "";
			recursive_key(typedef,0,type);
			id_echange_interactif = 0;
		});
	});
}

//Est appelé par bouton envoyer pour rediriger vers la fonction correspondante, avec les valeurs des champs
function lecture()
{
	ech1 = rosElement.querySelector('#echange1').value;
	ech2 = rosElement.querySelector('#echange2').value;
	console.log('lecture '+action);
	
	switch(action)
	{
		case "test":
		A_test(ech1,ech2,activeRos);
		break;

		case "topicPublisher":
		A_topicPublisher(ech1,ech2,activeRos);
		break;

		case "topicSubscriber":
		A_topicSubscriber(ech1,ech2,activeRos);
		break;

		case "serviceCall":
		A_serviceCall(ech1,ech2,activeRos);
		break;

		case "paramSetGet":
		A_paramSetGet(ech1,ech2,activeRos);
		break;

		default:
		converse("erreur action : "+action+" inconnue");
		break;
	}	
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

//modifie les placeholder et les autocomplete selon les cas
function Lien_action() 
{
	rosElement.querySelector("#echange1").className = "";
	rosElement.querySelector("#echange2").className = "";
	rosElement.querySelector("#echange1").removeAttribute("autocomplete");
	rosElement.querySelector("#echange2").removeAttribute("autocomplete");
	removeAC("echange1");
	i = rosElement.querySelector("#Liste").selectedIndex;
	if (i == 0)
	{
		rosElement.querySelector("#echange1").placeholder = '';
		rosElement.querySelector("#echange2").placeholder = '';
		//rosElement.querySelector("#echange3").placeholder = '';
	}
	else if (i == 5)
	{
		action=rosElement.querySelector("#Liste").options[i].value;
		console.log(action);

	}
	else
	{
		action=rosElement.querySelector("#Liste").options[i].value;
		console.log(action);
		rosElement.querySelector("#echange1").placeholder = window[rosElement.querySelector("#Liste").options[i].value][0];
		rosElement.querySelector("#echange2").placeholder = window[rosElement.querySelector("#Liste").options[i].value][1];
		//rosElement.querySelector("#echange3").placeholder = window[rosElement.querySelector("#Liste").options[i].value][2];
		if (i==1 || i == 2)
		{
			activeRos.getTopics(function(topics)
			{
				rosElement.querySelector("#echange1").className = "ui-autocomplete-input";
				autoComplete_AT('echange1',topics);
			});	
		}
		if (i==3) 
		{
			activeRos.getServices(function(services)
			{
				rosElement.querySelector("#echange1").className = "ui-autocomplete-input";
				autoComplete_AT('echange1',services);
			})
		}
		if (i==4) 
		{
			activeRos.getParams(function(params)
			{
				rosElement.querySelector("#echange1").className = "ui-autocomplete-input";
				autoComplete_AT('echange1',params);
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

function removeAC_AT(inputId) //active tab
{
	jQuery(function ($)
	{
		var id = "#"+inputId;
		var vide = new Array;
		$( id ).autocomplete({source: vide});
	});
}

function autoComplete_AT(inputId,array)
{
	jQuery(function ($)
	{
		var id = ".tab.active #"+inputId;
		$( id ).autocomplete({source:array});
	});
}	
