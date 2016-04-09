function addRobot(secure)
{
	var nameRobot = document.getElementById('name').value; 
	$("#Rtabs ul").append("<li class=\'\''><a id='#Rtabs-"+nameRobot+"' href='#Rtabs-"+nameRobot+"'>"+nameRobot+"</a></li>");
	$(".tab-content").append("<div class='tab' id='Rtabs-"+nameRobot+"'>"+document.getElementById('example').innerHTML+"</div>");
	reloadTabs();
	document.getElementById('#Rtabs-'+nameRobot).click();

	ROSLIBArray[nameRobot] = ROSLIB;
	rosArray[nameRobot] = new ROSLIBArray[nameRobot].Ros;

	activeRosName = nameRobot;
	activeRos = rosArray[activeRosName];
	rosElement = document.querySelector("#Rtabs-"+activeRosName);
	
	connect(secure, rosArray[nameRobot]);

	//mise en mémoire des onglets
	if(window.localStorage)
	{
		window.localStorage['web-gui.nameRobot='+window.localStorage.length] = nameRobot;
	}
	else
	{
		alert("le stockage local de données n'est pas activé, les modifications ne seront pas sauvegardées")
	}
	

}

function closeSession()
{
	var save = document.getElementById('save').checked;
	console.log(save);
	if(save != true)
		window.localStorage.clear();
}

function openSession()
{
	var nameRobot,item;
	console.log(window.localStorage.length);
	if(window.localStorage && window.localStorage.length != 0)
	{
		console.log(window.localStorage.length);
		for (var i = 0; i < window.localStorage.length; i++) 
		{
			item = "web-gui.nameRobot="+i;
			console.log(item);
			nameRobot = localStorage.getItem(''+item+'');
			$("#Rtabs ul").append("<li class=\'\''><a id='#Rtabs-"+nameRobot+"' href='#Rtabs-"+nameRobot+"'>"+nameRobot+"</a></li>");
			$(".tab-content").append("<div class='tab' id='Rtabs-"+nameRobot+"'>"+document.getElementById('example').innerHTML+"</div>");
			reloadTabs();
			document.getElementById('#Rtabs-'+nameRobot).click();
	
			ROSLIBArray[nameRobot] = ROSLIB;
			rosArray[nameRobot] = new ROSLIBArray[nameRobot].Ros;
			connect(secure, rosArray[nameRobot]);
		};
			//reloadTabs();
	}

}