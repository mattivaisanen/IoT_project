const apiURL = "https://webapi19sa-1.course.tamk.cloud/v1/weather";
let timespan = 20;
let urlpath = "temperature";
let label = "Temperature";
let labelunit = "Temperature (c)";
let sensorname = "temperature";

const timespandata = document.getElementById("timespan");
const sensordata = document.getElementById("sensor");

timespandata.addEventListener('change', function() {
    switch (timespandata.value){
      case "now":
        timespan = 20;
        break;
      case "24hours":
        timespan = 24;
        break;
      case "72hours":
        timespan = 72;
        break;
      case "1week":
        timespan = 168;
        break;
      case "1month":
        timespan = 730;
        break;
    };
    getData();
    
  });
  
  sensordata.addEventListener('change', function() {
    switch (sensordata.value){
      case "temperature":
        urlpath = `temperature`;
        label = "Temperature"
        labelunit = "Temperature (c)"
        sensorname = "temperature"
        break;
      case "windspeed":
        urlpath = `wind_speed`;
        label = "Wind Speed"
        labelunit = "Wind Speed (m/s)"
        sensorname = "wind_speed"
        break;
      case "winddirection":
        urlpath = `wind_direction`;
        label = "Wind Direction"
        labelunit = "Wind Direction (deg)"
        sensorname = "wind_direction"
        break;
      case "rainamount":
        urlpath = `rain`;
        label = "Rain Amount"
        labelunit = "Rain Amount (mm)"
        sensorname = "rain"
        break;
      case "humidity_in":
        urlpath = `humidity_in`;
        label = "Humidity Inside"
        labelunit = "Humidity (%)"
        sensorname = "humidity_in"
        break;
      case "humidity_out":
        urlpath = `humidity_out`;
        label = "Humidity Outside"
        labelunit = "Humidity (%)"
        sensorname = "humidity_out"
        break;
      case "light":
        urlpath = `light`;
        label = "Light level"
        labelunit = "Light level"
        sensorname = "light"
        break;
    };
    getData();
  });

function getData(){
    fetch(`${apiURL}/${urlpath}/${timespan}`)
    .then(response => response.json())
			.then(data => {
        document.getElementById("dataloader").style.display = 'none';
				var tbody = document.querySelector("#data-table tbody");        
        tbody.innerHTML = "";
				data.forEach(function(item) {
					var tr = document.createElement("tr");
					var td1 = document.createElement("td");
					var td2 = document.createElement("td");
					var td3 = document.createElement("td");
          const keys = Object.keys(item);
          const title = keys[1];
					td1.textContent = title.charAt(0).toUpperCase()+ title.slice(1);
					td2.textContent = item[`${sensorname}`];
          td3.textContent = item.date_time;
					tr.appendChild(td1);
					tr.appendChild(td2);
					tr.appendChild(td3);
					tbody.appendChild(tr);
				});
			})
			.catch(error => console.error(error));
        }
getData();