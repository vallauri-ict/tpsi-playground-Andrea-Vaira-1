"use strict";

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
          });
        }
      }
    });
  });
}
