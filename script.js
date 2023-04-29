const apiURL = "http://webapi19sa-1.course.tamk.cloud/v1/weather";
let timespan = 20;
let urlpath = "temperature";
let label = "Temperature";
let labelunit = "Temperature (c)";
let sensorname = "temperature";
let chart;

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
  document.getElementById("error").innerHTML = "";
  getWeather();
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
  document.getElementById("error").innerHTML = "";
  getWeather();

});

function getWeather(){
  showLoader();
  fetch(`${apiURL}/${urlpath}/${timespan}`)
  .then(response => response.json())
  .then(data => {
    const weatherData = data.map(item => item[`${sensorname}`]);
    console.log(weatherData);

    calulateMath(weatherData);

      const labels = Array.from({ length: weatherData.length }, (_, i ) => i + 1);
      const chartConfig = {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: label,
              data: weatherData,
              backgroundColor: 'rgba(21,36,42)',
              borderColor: 'rgba(109,3,3)',
              borderWidth: 3
          }]
      },
      options: {
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: labelunit,
              },
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
            }],
            xAxes:[{
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
            }]
          }
        }
      };
      const ctx = document.getElementById('chart').getContext('2d');
      if(chart != undefined) chart.destroy();
      chart = new Chart(ctx, chartConfig);
      chart.update();
  })
  .catch(error => {
    console.error(error);
    hideLoader();
    document.getElementById("error").innerHTML = "Error fetching data, check connection.";
  })
}


function getCurrentWeather(){
  fetch(`${apiURL}/current`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    document.getElementById("current_temp").innerHTML = data[1].temprerature;

  })
}

function showLoader(){
  document.getElementById("loader").style.display = 'block';
}

function hideLoader(){
  document.getElementById("loader").style.display = 'none';
}

function calulateMath(data){
  const mean = data.reduce((a, { b }) => a + parseFloat(data), 0) / data.length;
  const frequencyMap = data.reduce((map, { data }) => map.set(data, (map.get(data) || 0) + 1), new Map());
  const mode = [...frequencyMap.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const median = data.length % 2 === 0 ? (data[Math.floor(data.length / 2) - 1] + data[Math.floor(data.length / 2)]) / 2 : data[Math.floor(data.length / 2)];
  const standardDeviation = Math.sqrt(data.reduce((acc, { data }) => acc + (parseFloat(data) - mean) ** 2, 0) / (length - 1));

  document.getElementById("mean").innerText = `Mean: ${mean.toFixed(1)}`;
  console.log(mean);
  document.getElementById("mode").innerText = `Mode: ${mode}`;
  console.log(mode);
  document.getElementById("median").innerText = `Median: ${median}`;
  console.log(median);
  document.getElementById("range").innerText = `Range: ${(Math.max(...data)-Math.min(...data)).toFixed(1)}`;
  console.log(Math.max(...data)-Math.min(...data));
  document.getElementById("deviation").innerText = `Deviation: ${standardDeviation}`;
  console.log(standardDeviation);
}

getWeather();
getCurrentWeather();
