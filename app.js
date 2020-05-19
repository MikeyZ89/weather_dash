   // local storage let method, JSON used .parse(cities) getWeather
   let cities = localStorage.getItem("cities");
   if (cities) {
     cities = JSON.parse(cities);
     getWeather(cities[cities.length - 1]);
   } else {
     cities = [];
   }

   renderCities();

   $("#btn1").on("click", getInput);

   $("#cities").on("click", "button", function (e) {
     const city = $(this).text();
     getWeather(city);
   });
     // function rendercities / .empty clears the cash or it would keep stacking old data on top of one another.
   function renderCities() {
     $("#cities").empty();
     // used forEach to tell each function for city property to append. with .append. 
     cities.forEach(function (city) {
       $("#cities").append(
         $("<button>").attr("class", "btn btn-primary").text(city),
         $("<br>")
         // buttons styled with bootstrap .attr "attribute",.text creates the text (city) defined as previously searched 
       );
     });
   }

   function getWeather(city) {
     // ajax call to weather
     var queryURL1 = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=43f958adadb070693b1f19cfabbcb491`;
     // url pulled from openweathermap.com created api key. put in city as the search term.
     $.ajax({
       url: queryURL1, 
       method: "GET",
     //   using the "get" jquery method to then call the function response 1. this originally started as just response. but needing other queryURL as the ajax call grew was needed.
     }).then(function (response1) {
       var results = response1.data;
         // at this point i did have console.log.response as a way to pull the necessary information from the api
       var city = response1.name;
       var wind = response1.wind.speed;
       var humidity = response1.main.humidity;
       var temp = response1.main.temp;
       var lat = response1.coord.lat;
       var lon = response1.coord.lon;
       var m = moment();
         // creation of variables above then referenced for formatting, which is how they will be viewed in the html.
       $(".city").text(city + ": " + m.format("MMM Do YY"));
       $(".temp").text("Temperature: " + temp + "°F");
       $(".humidity").text("Humidity: " + humidity + "%");
       $(".wind").text("Wind Speed: " + wind);
         // query2 below called for the UV which was pulled by the longitude and latitude of the city term specified above.
       var queryURL2 = `http://api.openweathermap.org/data/2.5/uvi?appid=43f958adadb070693b1f19cfabbcb491&lat=${lat}&lon=${lon}`;
       $.ajax({
         url: queryURL2,
         method: "GET",
         // repeating the get method to call the new response for the UV info needed. 
         // created function , created variable for UV and jquery referenced to follow other variables above ,but did need to be in proper location of scope.
       }).then(function (response2) {
         var UV = response2.value;

         $(".UV").text("UV Index: " + UV);
         // query 3 below called for the 5 day forecast, could call to the original city for location, all up to this point is still included in the first ajax call. 
         var queryURL3 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=43f958adadb070693b1f19cfabbcb491`;
         $.ajax({
           url: queryURL3,
           method: "GET",
         //   same get method for the 5day response, created the variables and referenced as above format. 
         }).then(function (response3) {
           console.log("5 Day Forecast:_");
           console.log(response3);

           var forecast = response3.value;
           let currentDay = 1;
           for (let i = 0; i < response3.list.length; i++) {
             const day = response3.list[i];
             if (day.dt_txt.includes("15:00:00")) {
               var description = day.weather[0].description;
               var icon = day.weather[0].icon;
               var temp = day.main.temp;
               var humidity = day.main.humidity;

               $("#day" + currentDay)
                 .empty()
                 .append(
                   $("<p>").text(moment.unix(day.dt).format("MMM Do YY")),
                   $("<img>").attr(
                     "src",
                     "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                   ),
                   $("<p>").text(description),
                   $("<p>").text("Temp: " + Math.round(temp) + "\xB0 F"),
                   $("<p>").text("Humidity: " + humidity + "%")
                 );

               currentDay++;
             }
           }
         });
       });
     });
   }

   function getInput() {
     const city = $("#input").val().trim();
     if (!cities.includes(city)) {
       cities.push(city);
       localStorage.setItem("cities", JSON.stringify(cities));
       renderCities();
     }
     getWeather(city);
   }