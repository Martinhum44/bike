export default function({lane}) {
    if (!lane) return
    const {route_number, name, distance, safety, quality} = lane
    return (<div style={{display: "flex", justifyContent: "center", alignItems: "center", width:"300px", height: "250px", backgroundColor: "lightgray", borderRadius: "10px", flexDirection: "column"}}>
        <div style={{borderRadius: "100%", width: "50px", height:"50px", backgroundColor: "lightblue"}}>
            <h3>{route_number}</h3>
        </div>
        <h3>{name}</h3>
        <h4>{(distance/1000).toFixed(2)} km</h4>
        <p>safety: {safety*100}%, quailty: {quality*100}%</p>
    </div>)
} 