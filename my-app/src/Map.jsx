import { MapContainer, TileLayer, Polyline, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {useState, useEffect} from "react"
import BikelaneInfoDisplay from "./BikelaneInfoDisplay";
import bike_lanes from "./lanes"
import Lane from "./Lane"

function getGeoLocation() {
    return new Promise((resolve, reject) => {
        if(!navigator.geolocation) {
            reject("BAD")
        }

         navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => reject(err),
            { enableHighAccuracy: true }
        );
    })
}

function getRandomDecimal(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPointFrom(lat, lon, dist) {
    const degrees_lat = dist / 111320 / Math.sqrt(2)
    const degrees_lon = dist / (111320 * Math.cos(lat)) / Math.sqrt(2)

    console.log([getRandomDecimal(lat-degrees_lat, lat+degrees_lat), getRandomDecimal(lon-degrees_lon, lon+degrees_lon) ])

    return [getRandomDecimal(lat-degrees_lat, lat+degrees_lat), getRandomDecimal(lon-degrees_lon, lon+degrees_lon) ]
}

function Map(){
    const [props, setProps] = useState()
    const [item, setItem] = useState([])
    const [loc, setLoc] = useState()
    const [random, setRandom] = useState()
    const [meters, setMeters] = useState(0)
    const [initalDistance, setInitialDistance] = useState(0)

    useEffect(() => {
        if (localStorage.getItem("points_reached") == null) {
            localStorage.setItem("points_reached", 0)
            localStorage.setItem("distance_of_points", 0)
        }

        async function f(){
            const a = await fetch("https://overpass-api.de/api/interpreter?data=[out:json];way[highway=cycleway](19.19,-99.36,19.59,-98.94);out geom;")
            const json = await a.json()
            console.log(json)
            setItem(json.elements)
        }

        f()
    },[])

    useEffect(() => {
            async function f(){
                const location = await getGeoLocation()
                setLoc(location)
                    
                if (loc && random){
                    if(L.latLng(location).distanceTo(L.latLng(random)) < 50) {
                        setRandom(randomPointFrom(...location, meters))

                        localStorage.setItem("points_reached", Number(localStorage.getItem("points_reached")) + 1)
                        localStorage.setItem("distance_of_points", Number(localStorage.getItem("distance_of_points")) + initalDistance)
                    }
                }
            }

            f()
    })

    const bike_lanes_geo = item.map((lane) => {
        const lat_lon = lane.geometry.map(point => [point.lat, point.lon])
        return lat_lon
    })

    const bike_lanes_prev = bike_lanes_geo.map((lane) => new Lane(0, "no name", lane, 0, 0))
    
    if (loc) { return (
        <div style={{display: "flex"}}>
            <MapContainer 
            center={loc}
            zoom={13}
            style={{ height: "75vh", width: "75vh", border: "5px solid red"}}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {bike_lanes.map(lane => {
                    return <Polyline 
                        positions={lane.points}
                        pathOptions={{
                        color: "#00cc66",    // green bike lane
                        weight: 5,           // thicker
                        opacity: 0.9,
                    }}
                    eventHandlers={{
                        mouseover: (e) => {
                            setProps(lane)
                        },
                    }}
                    />
                })}
                <Circle
                    center={loc}   // lat, lng
                    radius={50}                   // meters
                    pathOptions={{
                        color: "blue",
                        fillColor: "blue",
                        fillOpacity: 0.3,
                    }}
                />

                <div style={{display: random ? "block" : "none"}}>
                    <Circle
                    center={random ? random : [0,0]}   // lat, lng
                    radius={50}                   // meters
                    pathOptions={{
                        color: "red",
                        fillColor: "blue",
                        fillOpacity: 0.3,
                    }}
                />
                </div>
            </MapContainer>
            <div style={{display: props ? "flex" : "none", margin: "10px", alignItems: "center", justifyContent: "center"}}>
                <BikelaneInfoDisplay lane={props}/>
            </div>

           <div style={{display:"flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} id="divvy">
            <input placeholder="meters away" type="number" onChange={(e) => {setMeters(e.target.value)}} style={{height: 30, width: 200, backgroundColor: "#cececeff", fontSize: 18, border: "none", borderRadius: "10px"}}/> 
            <button disabled={ meters < 200 || !meters } style={{height: 50, width: 200, backgroundColor: "#4590ffff"}} onClick={() => {
                setRandom(randomPointFrom(...loc, meters)) 
                setInitialDistance(L.latLng(loc).distanceTo(L.latLng(random)))         
            }}>
                Random point
            </button>
            <h4>{loc && random ? `The random point is ${L.latLng(loc).distanceTo(L.latLng(random)).toFixed(2)} meters away` : ""}</h4>
           </div>
           <h4>Points: {localStorage.getItem("points_reached")}, Distance of pointss: {Number(localStorage.getItem("distance_of_points")).toFixed(2)}</h4>
        </div>
        
    ) }
    else {
        return <h1>Loading location...</h1>
    }
}

export default Map