import axios from 'axios'

export function test() {
  console.log("A TESTONE")
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lon1}:${lat2},${lon2}/json?key=VtdGJcQDaomboK5S3kbxFvhtbupZjoK0`)
    .then(res => {
      let distance = Math.floor(res.data.routes[0].summary.lengthInMeters / 1000)
      console.log(distance + ' km')
      console.log('Latitude: ' + lat1)
      console.log('Longitude: ' + lon1)
    })
}

export function getImageUrl(image) {
  return `http://localhost:8000/storage/images/${image}`;
}