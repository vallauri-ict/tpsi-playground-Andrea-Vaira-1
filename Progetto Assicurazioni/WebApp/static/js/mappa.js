"use strict";

function disegnaPercorso(perizia, latlng) {
  let directionsService = new google.maps.DirectionsService();
  let routesOptions = {
    origin: latlng,
    destination: new google.maps.LatLng(
      perizia.coordinate.latitude,
      perizia.coordinate.longitude
    ),
    travelMode: google.maps.TravelMode.DRIVING, // default
    provideRouteAlternatives: true, // default=false
    avoidTolls: false, // default (pedaggi)
  };

  let promise = directionsService.route(routesOptions);
  promise.then(function (directionsRoutes) {
    let mapOptions = {
      /*zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,*/
    };
    let mappa = new google.maps.Map(
      document.getElementById("#mappaPercorso"),
      mapOptions
    );
    if (directionsRoutes.status == google.maps.DirectionsStatus.OK) {
      console.log(directionsRoutes.routes[0]);
      let i = 1;

      for (const route of directionsRoutes.routes) {
        let color;

        if (i == 1) {
          color = "#44F";
        } else {
          color = `rgb(${60 * i}, ${60 * i}, ${60 * i})`;
        }
        let renderOptions = {
          polylineOptions: {
            strokeColor: color, // colore del percorso
            strokeWeight: 6, // spessore
            zIndex: 100 - i, // posizionamento
          },
        };

        let directionRenderer = new google.maps.DirectionsRenderer(
          renderOptions
        );

        directionRenderer.setMap(mappa);
        directionRenderer.setRouteIndex(i - 1);
        directionRenderer.setDirections(directionsRoutes);

        let distanza = route.legs[0].distance.text;
        let tempo = route.legs[0].duration.text;

        console.log(distanza, tempo);

        i++;
      }
    }
  });
  promise.catch(function () {
    console.log("errore");
  });
}


function popolaMappa(perizie) {
  let geocoder = new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition((position) => {
    let latlng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        let mapOptions = {
          center: results[0].geometry.location,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP, // default=ROADMAP
        };
        mappa = new google.maps.Map($("#map")[0], mapOptions);
        for (const perizia of perizie) {
          let currentPos = new google.maps.LatLng(
            perizia.coordinate.latitude,
            perizia.coordinate.longitude
          );
          let markerOptions = {
            map: mappa,
            position: currentPos,
            perizia,
          };
          let marcatore = new google.maps.Marker(markerOptions);
          marcatore.addListener("click", function () {
            console.log(this.perizia);
            $("#perizia").show();
            $("#home").hide();

            disegnaPercorso(this.perizia, latlng);

            /*directionsService.route(routesOptions, function (directionsRoutes) {
              //let mapOptions = {};
              let mappa = new google.maps.Map(
                $("#mappaPercorso")[0],
                mapOptions
              );
              if (directionsRoutes.status == google.maps.DirectionsStatus.OK)
                console.log(directionsRoutes.routes[0]);
            });*/
          });
        }
      }
    });
  });
}
