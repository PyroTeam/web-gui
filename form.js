//lecture du formulaire
var id_echange_interactif = 0;
var ros ='';
var status ='Closed';
var ech1='',ech2='';

var form='';
var element = '<fieldset><legend>Formulaire interactif</legend> <form name="echange_interactif" action="#" method="post">';


var requestedBytes = 1024*1024; 

/*navigator.webkitStorageInfo.requestQuota (
    PERSISTENT, requestedBytes, function(grantedBytes) {  
        window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler); 

    }, function(e) { console.log('Error', e); }
);*/

//publie un message dans le chat
function converse(message) 
{
	var maj = document.getElementById("conversation").innerHTML;
	maj += '<br>' + message;
	document.getElementById("conversation").innerHTML = maj;
} 

// rempli un objet défini mais vide à partir d'un formulaire
function genFromForm(typedef)  
{
	var navigateur = new Array;
	var i = 1,j = 0;
	var floatType = ["float64","float32"];
	var intType = ["uint8","uint16","uint32","uint64"];
	if (document.getElementById(i).innerHTML == '' && i == 1) //seulement une ligne d'input
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
	else //objet complexe
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
				if ((document.getElementById(i).placeholder.indexOf("float") >= 0) && floatType.indexOf(document.getElementById(i).placeholder) != -1)
					typedef[navigateur[j]][document.getElementById(i).name]=parseFloat(document.getElementById(i).value);
				if ((document.getElementById(i).placeholder.indexOf("int") >= 0) && intType.indexOf(document.getElementById(i).placeholder) != -1)
					typedef[navigateur[j]][document.getElementById(i).name]=parseInt(document.getElementById(i).value);
				if (document.getElementById(i).placeholder == "string")
					typedef[navigateur[j]][document.getElementById(i).name]=document.getElementById(i).value.toString();
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
	if (action == "topicPublisher")
	{
		var type = document.getElementById('0').innerHTML;
		//var i = 1,j = 0;
		typedef = genFromForm(typedef);
		
		var message = new ROSLIB.Message;
		message = typedef;
		publisher(ech1,type,message);
	}

	if (action == "serviceCall") 
	{
		ros.getServiceType(ech1,function(serviceTypes)
		{
			
			var type = document.getElementById('0').innerHTML;
			if(document.getElementById('1') != null)  
			{
				typedef = genFromForm(typedef); //verifier l'existence d'1 input
			}
			var request = new ROSLIB.ServiceRequest;
			request = typedef;
			callSrv(ech1,type,request);
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
function A_topicPublisher(ech1,ech2)
{
	converse(ech1);
	ros.getTopicType(ech1,function(topicTypes)
	{
		type = topicTypes;
		ros.getMessageDetails(type,function(getMessageDetails)
		{
			def = getMessageDetails;
			typedef = ros.decodeTypeDefs(def);
			form='';
			//document.getElementById('echange_interactif').innerHTML = "";
			recursive_key(typedef,0,type);
			$('#echange_interactif').empty();
			$('#echange_interactif').append(element + form+'<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button></form></fieldset>');
			//document.getElementById('echange_interactif').innerHTML += '<br><br><button onclick="conf(\''+ech1+'\');" type="button" id="confirmer" value="confirmer" title="Confirmer">Confirmer</button>';
			id_echange_interactif = 0;
			
		});
	});
}

function A_topicSubscriber(ech1,ech2)
{
	ros.getTopicType(ech1,function(topicTypes)
	{
		type = topicTypes;
		subscriber(ech1,type);
	});
}

function A_serviceCall(ech1,ech2)
{
	converse(ech1);
	ros.getServiceType(ech1,function(serviceTypes)
	{
		type = serviceTypes;
		getSrvRequestDetails(type,function(getSrvRequestDetails)
		{
			req = getSrvRequestDetails
			typedef = ros.decodeTypeDefs(req);
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

function A_paramSetGet(ech1,ech2)
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
			
	});				
}

function A_test(ech1,ech2)
{
	ros.getTopicType(ech1,function(topicTypes)
	{
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

//Est appelé par bouton envoyer pour rediriger vers la fonction correspondante, avec les valeurs des champs
function lecture()
{
	ech1 = document.getElementById('echange1').value;
	ech2 = document.getElementById('echange2').value;
	console.log('lecture '+action);
	
	switch(action)
	{
		case "test":
		A_test(ech1,ech2);
		break;

		case "topicPublisher":
		A_topicPublisher(ech1,ech2);
		break;

		case "topicSubscriber":
		A_topicSubscriber(ech1,ech2);
		break;

		case "serviceCall":
		A_serviceCall(ech1,ech2);
		break;

		case "paramSetGet":
		A_paramSetGet(ech1,ech2);
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
	else if (i == 5)
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
		if (i==4) 
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
