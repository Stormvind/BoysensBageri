// Variabler för dokumentets diverse delar
var tableRows = document.getElementsByClassName("tableRowItem");
var breadMenu = document.getElementById("breadMenu");
var timeMenu = document.getElementById("timeMenu");
var amountMenu = document.getElementById("amountMenu");
var orderForm = document.getElementById("orderForm");
var submitButton = document.getElementById("submitButton");
var addButton = document.getElementById("addButton");
var removeButton = document.getElementById("removeButton");
var totalCost = 0;

window.onload = function()
{	
	// Ifyll tidsmenyn
	var todaysDate = new Date();
	var today = todaysDate.getDay();
	if (today >= 5 && today<= 6)
	{
		populateTimeMenu(9, 16);
	}
	else
	{
		populateTimeMenu(8, 17);
	}
	// Giv knapparna sina funktioner
	addButton.onclick = function()
	{
		addBreadItem();
	}
	
	removeButton.onclick = function()
	{
		removeBreadItem();
	}
	
	submitButton.onclick = function()
	{
		placeOrder();
	}

}

// Den här funktionen justerar vilken tid man kan beställa bakelser för beroende på veckodag
function populateTimeMenu(start, end)
{
	while (start <= end)
	{
			if (start < 10)
			{
				var tempOption = document.createElement("OPTION");
				var tempTextNode = document.createTextNode("0"+start+":00");
				tempOption.appendChild(tempTextNode);
				timeMenu.appendChild(tempOption);	
			}
			else
			{
				var tempOption = document.createElement("OPTION");
				var tempTextNode = document.createTextNode(start+":00");
				tempOption.appendChild(tempTextNode);
				timeMenu.appendChild(tempOption);
			}
			start++;
	}
}

// Den här funktionen lägger till bakelser till kvittotabellen
function addBreadItem()
{
	// Denna funktion lägger till bakelser till kvittotabellen på följande vis:
	// Gå igenom alla rader och kolla om brödtypen som är vald finnes på en av dem. Om den finns, addera in på den raden.  Kolla också om raden är ledig.  Om den är det, spara indexet i en variabel. Om brödtypen inte
	//fanns på någon rad, lägg in det nya brödet på det lediga indexet.
	if (breadMenu.value != "noChoice")
	{
		var success = false;
		var i = 0;
		var unoccupiedRow = -1;
		var rowFound = false;
		
		while (i < tableRows.length && success == false)
		{
			if (tableRows[i].childNodes[0].innerHTML == breadMenu.value) // Om den nuvarande radens bakelse är av samma typ som den  / devalda
			{
				tableRows[i].childNodes[1].innerHTML = parseInt(tableRows[i].childNodes[1].innerHTML) + parseInt(amountMenu.value); // Addera samman deras antal
				tableRows[i].childNodes[2].innerHTML = parseInt(tableRows[i].childNodes[2].innerHTML) + parseInt(amountMenu.value)*getBreadItemCost(); // Addera samman kostnad för dessa bakelser
				totalCost = totalCost + parseInt(amountMenu.value)*getBreadItemCost(); // Addera till total kostnad för alla bakelser
				tableRows[0].childNodes[3].innerHTML = totalCost;
				success = true;
			}
			if (tableRows[i].childNodes[0].innerHTML == "" && rowFound == false) // Spara indexet för en ledig rad
			{
				unoccupiedRow = i;
				rowFound = true;
			}
			i++;
		}
		
		if (success == false) // Om den valda bakelsen inte fanns i någon rad
		{	// Eftersom det här är den första bakelsen av sin typ adderar vi inte samman två tal, förutom totalkostnaden; vi bara lägger in värdet av det som var valt
			tableRows[unoccupiedRow].childNodes[0].innerHTML = breadMenu.value; // Lägger in namnet
			tableRows[unoccupiedRow].childNodes[1].innerHTML = amountMenu.value; 	// Lägger in antalet
			tableRows[unoccupiedRow].childNodes[2].innerHTML = getBreadItemCost()*amountMenu.value; // Lägger in kostnaden för dessa bakelser
			totalCost = totalCost + parseInt(amountMenu.value)*getBreadItemCost(); // Adderar till totalkostnad
			tableRows[0].childNodes[3].innerHTML = totalCost;

		}
	}
}

function removeBreadItem()
{
	// Den här funktionen tager bort bakelser från kvittotabellen, på följande vis:
	// Gå igenom alla rader och kolla om brödtypen som är vald finns på en av den. Om den finns, subtrahera mängeden vald från den raden. Om resultatet är 0 eller negativt, blankställ innerHTML.
	if (breadMenu.value != "noChoice")
	{
		var i = 0;
		var success = false;
		
		while (i < tableRows.length && success == false) // Medan den valda bakelsetypen inte funnits i en rad
		{
		if (tableRows[i].childNodes[0].innerHTML == breadMenu.value) // Om namnet på den valda bakelsen och bakelsen i den nuvarande raden äro lika
		{
			tableRows[i].childNodes[1].innerHTML = parseInt(tableRows[i].childNodes[1].innerHTML) - amountMenu.value; // Subtrahera antal
			if (parseInt(tableRows[i].childNodes[1].innerHTML) <= 0) // Om antal är under 0,...
			{
				tableRows[i].childNodes[1].innerHTML = ""; // Nollställ radens värden
				tableRows[i].childNodes[0].innerHTML = "";
			}
				
			tableRows[i].childNodes[2].innerHTML = parseInt(tableRows[i].childNodes[2].innerHTML) - getBreadItemCost()*amountMenu.value; // Subtrahera kostnad för de valda bakelserna
			if (parseInt(tableRows[i].childNodes[2].innerHTML) <= 0)
			{
				tableRows[i].childNodes[2].innerHTML = "";
				tableRows[i].childNodes[0].innerHTML = "";
			}
				
			totalCost = totalCost - parseInt(amountMenu.value)*getBreadItemCost();; // Subtrahera totalkostnaden
			if (totalCost <= 0)
			{
				tableRows[0].childNodes[3].innerHTML = totalCost;
				tableRows[0].childNodes[3].innerHTML = "";
				totalCost = 0;
			}
			
			}
		i++;
		}
	}
}
// Att göra om tid finnes: Implementera en bättre lösning som inte kräver en if else kedja
function getBreadItemCost()
{
	var cost = 0;
	var temp = breadMenu.value;
	
	if (temp == "Kanelbulle")
	{
		cost = 25;
	}
	else if (temp == "Kardemummabulle")
	{
		cost = 28;
	}
	
	else if (temp == "Croissant")
	{
		cost = 20;
	}
	
	else if (temp == "Surdegslimpa")
	{
		cost = 40;
	}
	return cost;
}

function placeOrder()
{
	
	if (timeMenu.value != "noChoice")
	{
		var success = false;
		var i = 0;
		while (i < tableRows.length && success == false)
		{
			if (tableRows[i].childNodes[0].innerHTML != "")
			{
				success = true;
			}
			i++;
		}
	}
	
	if (success == true)
	{
		window.location.assign("bestallt.html");
	}
	else
	{
		alert("Du måste välja en tid och minst en bakelse för att beställa");
	}
}