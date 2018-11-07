<!doctype html>
<!--Calvin Chen-->
 
<html>
    <head>
         <title>Simple Map</title>
        <meta name="viewport" content="initial-scale=1.0">
        <meta charset="utf-8">
        <style>
            /* Always set the map height explicitly to define the size of the div
            * element that contains the map. */
            #map {
            height: 100%;
            }
            /* Optional: Makes the sample page fill the window. */
            html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            }
            #floating-panel {
                position: absolute;
                top: 10px;
                left: 25%;
                z-index: 5;
                background-color: #fff;
                padding: 5px;
                border: 1px solid #999;
                text-align: center;
                font-family: 'Roboto','sans-serif';
                line-height: 30px;
                padding-left: 10px;
            }
        </style>
        <script type = "text/javascript">
            function Point(x, y) {
                this.x = x;
                this.y = y;
 
                this.distance = function (p) {
                    return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2))
                }
 
                this.closestPoint = function (points) {
                    minIdx = 0;
                    distance = this.distance(points[0]);
                    for (i = 0; i < points.length; i++) {
                       currDist = this.distance(points[i]);
                       if (currDist < distance) {
                           minIdx = i;
                           distance = currDist;
                       }
                   }
                   return minIdx;
               }
 
               this.equals = function(p){
                   return (p.x == this.x && p.y == this.y);
               }
           }
 
           function avg(points) {
               x = 0.0;
               y = 0.0;
               for (var i = 0; i < points.length; i++) {
                   x += points[i].x;
                   y += points[i].y;
               }
               x = x / points.length;
               y = x / points.length;
               return new Point(x, y);
           }
 
           function equalArrays(a1, a2) {
               if (a1.length != a2.length)
                   return false;
               for (var i = 0; i < a1.length; i++) {
                   if (!(markersEqual(a1[i], a2[i])))
                       return false;
               }
               return true;
           }
           
           //function markerDistance(place1, place2, callback) {
           //    service = new google.maps.DirectionsService();
           //    //var ttl = 0;
           //    //sets up google's routing service
           //    service.route({
           //        origin: place1.getPosition(),
           //        destination: place2.getPosition(),
           //        travelMode: 'DRIVING',
           //        unitSystem: google.maps.UnitSystem.IMPERIAL,
           //    }, function (result, status) {
           //        if (status == 'OK') {
           //            //adds up all leg distances in route
           //            legs = result.routes[0].legs;
           //            ttl = 0;
           //            for (var i = 0; i < legs.length; i++) {
           //                ttl += legs[i].distance.value
           //            }
           //            console.log(ttl)
           //            callback(ttl);
           //        }
           //        }
           //    )
           //    //setTimeout(Function.prototype, 10000);
           //    return ttl;
           //}
           function markerDistance(place1, place2) {
               //return new Promise(function (resolve, reject) {
               //    var service = new google.maps.DirectionsService();
               //    //var ttl = 0;
               //    //sets up google's routing service
               //    service.route({
               //        origin: place1.getPosition(),
               //        destination: place2.getPosition(),
               //        travelMode: 'DRIVING',
               //        unitSystem: google.maps.UnitSystem.IMPERIAL,
               //    }, function (result, status) {
               //        if (status == 'OK') {
               //            //adds up all leg distances in route
               //            legs = result.routes[0].legs;
               //            ttl = 0;
               //            for (var i = 0; i < legs.length; i++) {
               //                ttl += legs[i].distance.value
               //            }
               //            resolve(ttl);
               //        } else {
               //            var reason = new Error('google api not happy');
               //            reject(reason);
               //        }
               //    });
               //});
               var service = new google.maps.DirectionsService();
                   //sets up google's routing service
                   service.route({
                       origin: place1.getPosition(),
                       destination: place2.getPosition(),
                       travelMode: 'DRIVING',
                       unitSystem: google.maps.UnitSystem.IMPERIAL,
                   }, function (result, status) {
                       if (status == 'OK') {
                           //adds up all leg distances in route
                           legs = result.routes[0].legs;
                           var ttl = 0;
                           for (var i = 0; i < legs.length; i++) {
                               ttl += legs[i].distance.value
                           }
                           return ttl;
                       } else {
                           var reason = new Error('google api not happy');
                       }
                   });
           }
           function markersEqual(m1, m2) {
               return (m1.getPosition() == m2.getPosition());
           }
           function avgLatLng(locations, resultsMap) {
               lat = 0;
               lng = 0;
               for (var i = 0; i < locations.length; i++) {
                   lat += locations[i].getPosition().lat();
                   lng += locations[i].getPosition().lng();
               }
               lat = lat / locations.length;
               lng = lng / locations.length;
               var marker = new google.maps.Marker({
                   map: resultsMap,
                   position: { lat, lng },
                   title: 'Avg'
               });
               //console.log(marker);
               //console.log(lat);
               return new google.maps.LatLng(lat, lng);
           }
           async function help(place1, place2) {
               var markerPromise = await markerDistance(place1, place2);
               console.log("asjdflk:", markerPromise);
               var distance;
               //markerPromise.then(function (value) {
               //    console.log(value);
               //    distance = value;
               //    console.log(distance);
               //});
               return distance;
           }
           //finds the closest centroid from place
           function closestLocation(place, centroids){
               minidx = 0;
               //var markerPromise = markerDistance(place, centroids[0]);
               //var distance;
               //markerPromise.then(function (value) {
               //    console.log(value);
               //    distance = value;
               //});
               var distance = help(place, centroids[0]);
               console.log(distance);
               for (i = 0; i < centroids.length; i++) {
                   //var currDist;
                   //markerPromise = markerDistance(place, centroids[i]);
                   //markerPromise.then(function (value) {
                   //    currDist = value;
                   //});
                   var currDist = help(place, centroids[i]);
                   console.log(i, currDist, distance);
                   if (currDist < distance) {
                       minidx = i;
                       distance = currDist;
                   }
               }
               return minidx;
               //if (i >= centroids.length) {
                //    console.log("hi:", min);
                //    return min;
                //}
 
                //markerDistance(place, centroids[i], function (dist) {
                //    if (i == centroids.length-1) {
                //        console.log("hi:", min, dist, distance);
                //        if (dist < distance) {
               //            console.log('alskdjflkjsaldf', i);
               //            return i;
               //        }
               //        return min;
               //    }
 
               //    if (dist < distance || distance == -1)
               //        return closestLocation(place, centroids, dist, i+1, i);
               //    else
               //        return closestLocation(place, centroids, distance, i+1, min);
               //});
           }
 
           //function factorial(n) {
           //    if (n == 0)
           //        return 1;
           //    else {
           //        return (n * factorial(n - 1));
           //    }
           //}
 
           a = new Point(0, 0);
           b = new Point(3, 4);
           c = new Point(5, 5);
           d = new Point(1, 7);
           e = new Point(5, 9);
           f = new Point(6, 2);
           points = [a, b, c, d, e, f]
 
           //k-means clustering
           //function mTSP(points, people) {
           //    centroids = new Array(people);
           //    routes = new Array(people);
 
           //    //Generate random centroids
           //    for (var i = 0; i < people; i++) {
           //        centroids[i] = new Point(Math.random() * 10, Math.random() * 10);
           //    }
 
           //    convergence = false;
 
           //    while (!convergence) {
           //        //reset clusters
           //        for (var i = 0; i < routes.length; i++)
           //            routes[i] = new Array()
 
           //        //separate into clusters
           //        for (var i = 0; i < points.length; i++) {
           //            routes[points[i].closestPoint(centroids)].push(points[i]);
           //        }
 
           //        //find new centroid
           //        newCentroids = new Array(people)
           //        for (var i = 0; i < centroids.length; i++) {
           //            newCentroids[i] = avg(routes[i])
           //        }
           //        //console.log(newCentroids);
           //        //console.log(centroids)
           //        convergence = equalArrays(centroids, newCentroids);
           //        centroids = newCentroids;
           //    }
 
           //    //console.log(routes)
           //    return routes;
           //}
 
           function maps_mTSP(locations, people) {
               centroids = new Array(people);
               routes = new Array(people);
 
               //Generate random centroids
               for (var i = 0; i < people; i++) {
                   bool1 = Math.random() < 0.5 ? -1 : 1;
                   bool2 = Math.random() < 0.5 ? -1 : 1;
                   centroids[i] = new google.maps.LatLng(bool1 * Math.random()*90, bool2 * Math.random()*180);
               }
 
               convergence = false;
 
               while (!convergence) {
                   //reset clusters
                   for (var i = 0; i < routes.length; i++)
                       routes[i] = new Array()
 
                   //separate into clusters
                   for (var i = 0; i < locations.length; i++) {
                       routes[closestLocation(locations[i],centroids)].push(locations[i]);
                   }
 
                   //find new centroid
                   newCentroids = new Array(people)
                   for (var i = 0; i < centroids.length; i++) {
                       newCentroids[i] = avgLatLng(routes[i])
                   }
                   //console.log(newCentroids);
                   //console.log(centroids)
                   convergence = equalArrays(centroids, newCentroids);
                   centroids = newCentroids;
               }
 
               //console.log(routes)
               return routes;
           }
           //array1 = [a, b];
           //array2 = [a, b];
           //console.log(equalArrays(array1, array2))
           //mTSP(points, 2);
 
           //assuming locations is list of address strings
           function dropMarkers(locations) {
               var geocoder = new google.maps.Geocoder();
               for (var i = 0; i < locations.length; i++) {
                   geocoder.geocode({ 'address': locations[i] }, function (results, status) {
                       if (status === 'OK') {
                           //resultsMap.setCenter(results[0].geometry.location);
                           var marker = new google.maps.Marker({
                               map: map,
                               position: results[0].geometry.location,
                               //label: 'A'
                           });
                           //locations.push(marker);
                           //console.log(locations);
                       } else {
                           alert('Geocode was not successful for the following reason: ' + status);
                       }
                   });
               }
           }
 
           test = ["8059 Crescent Ave. Staten Island, NY 10312", "563 Willow St. Brooklyn, NY 11201", "9778 West Honey Creek St. North Tonawanda, NY 14120",
               "368 Oakwood Ave. Webster, NY 14580", "53 W. Pilgrim Dr. Brooklyn, NY 11204"];
        </script>  
    </head>
 
    <body>
        <div id="map"></div>
        <div id="floating-panel">
            <input id="address" type="textbox" value="Sydney, NSW">
            <input id="submit" type="button" value="Geocode">
        </div>
        <div id="map"></div>
        <script>
            var map;
            function initMap() {
                    map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 12,
                        center: { lat: 43.2994, lng: -74.2179 }
                });
                var geocoder = new google.maps.Geocoder();
 
                document.getElementById('submit').addEventListener('click', function () {
                    geocodeAddress(geocoder, map);
                });
            }
 
            locations = new Array();
            //Google code
            function geocodeAddress(geocoder, resultsMap) {
                var address = document.getElementById('address').value;
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location,
                            //label: 'A'
                        });
                        locations.push(marker);
                        console.log(locations);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCoHhrD9QVajfK8pnquBi9y4veMFbVGedo&callback=initMap"
               async defer></script>
    </body>
</html>