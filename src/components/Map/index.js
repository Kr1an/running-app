
import React from "react";
import {
  compose,
  withProps as injectProps,
} from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
} from "react-google-maps";
var PolyBool = require('polybooljs');

const mergePolyis = polyis => {
  const processedPolyis = polyis.map(poly => [poly.map(x => [x.lat, x.lng])]);
  const result = processedPolyis.reduce((acc, curr) => {
    return PolyBool.union({
      regions: acc,
      inverted: false,
    }, {
      regions: curr,
      inverted: false
    }).regions;
  }, []);
  const transformedBackResult = result.map(x => x.map(y => ({ lat: y[0], lng: y[1]})))
  return transformedBackResult
}
const generateBox = (center, size) => [
  { lat: center.lat + size / 3.5, lng: center.lng + size / 2},
  { lat: center.lat + size / 3.5, lng: center.lng - size / 2},
  { lat: center.lat - size / 3.5, lng: center.lng - size / 2},
  { lat: center.lat - size / 3.5, lng: center.lng + size / 2},
]

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lng: 27.5615, lat: 53.9045 }
    };
  }
  render() {
    const {
      points,
      outer,
    } = this.props
    
    const outerPolygon = outer;
    const innerPolygon = !points.length ? [] : mergePolyis(points.map(x => generateBox(x, this.props.blockSize)))

    return (
      <GoogleMap
        defaultZoom={this.props.fixed ? 16 : 12}
        zoom={this.props.fixed ? 16 : 12}
        center={this.props.focus || this.state.center}
        options={{
          draggable: !this.props.fixed,
          zoomControl: !this.props.fixed,
          scrollwheel: !this.props.fixed,
          disableDoubleClickZoom: !this.props.fixed,
        }}
      >
        <Polygon
          paths={[
            outerPolygon,
            ...innerPolygon,
          ]}
          options={{
            strokeWeight: 0,
          }}
        />
      </GoogleMap>
    );
  }
}


const withProps = injectProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyABeIyTjm8oH7-6zx5XzE_5MILB2aPPpjs",
  loadingElement: <div style={{ height: '100vh' }} />,
  containerElement: <div style={{ height: '100vh', width: '100%' }} />,
  mapElement: <div style={{ height: '100%' }} />,
})


export default compose(
  withProps,
  withScriptjs,
  withGoogleMap,
)(Map);
