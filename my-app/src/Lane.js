export default class {
   constructor(route_number, name, points, quality, safety) {
        this.route_number = route_number,
        this.name = name,
        this.points = points,
        this.distance = this.getPolyLineLength(),
        this.quality = quality,
        this.safety = safety
    }

    getPolyLineLength() {
        let total = 0

        for(let i = 0; i < this.points.length -1 ; i++) {
            const p1 = L.latLng(this.points[i]);
            const p2 = L.latLng(this.points[i + 1]);
            total += p1.distanceTo(p2);
        }

        return total
    }
}