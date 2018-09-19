import React, { Component } from 'react';
// import firebase from 'firebase';
import Fullscreen from "react-full-screen";
import GUI from '../GUI';
import Map from '../Map';
import Loading from './Loading.png';
import './style.css';

const geoOptions = {
  enableHighAccuracy: true,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      historyPoints: this.uploadFromLocalstorage(),
      currentPoints: [],
      size: 0.001,
      alphaAngle: 90,
    }
    this.lockedState = false;
  }
  manualTriggerWatchPosition = () => {
    navigator.geolocation.getCurrentPosition(this.watchPosition, this.errorPosition, geoOptions)
  }
  distanceBetween2Points = (pointA, pointB) => {
    if (!pointA || !pointB) {
      return Infinity;
    }
    const width = pointA.lat - pointB.lat;
    const height = pointA.lng - pointB.lng;
    const distance = Math.sqrt(width * width + height * height);
    return distance
    
  }
  watchPosition = position => {
    if (!this.state.active) {
      return
    }
    const point = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
    const previousPoint = this.state.currentPoints[this.state.currentPoints.length - 1]

    if (this.distanceBetween2Points(point, previousPoint) < this.state.size / 2) {
      console.log('point filtered by distance')
      return;
    }
    
    console.log(point, 'added to points');
    this.setState({ currentPoints: [...this.state.currentPoints, point] })

  }
  errorPosition = error => {
    console.log('error');
  }
  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(this.watchPosition, this.errorPosition, geoOptions);
    window.addEventListener("deviceorientation", this.handleOrientation, true);
  } 
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    window.removeEventListener("deviceorientation", this.handleOrientation)
  }
  handleOrientation = (event) => this.setState({ alphaAngle: event.alpha })
  updateLocalstorage = (points = this.props.historyPoints) => {
    localStorage.setItem('points', JSON.stringify(points))
  }
  uploadFromLocalstorage = () => {
    const rowPoints = localStorage.getItem('points')
    if (!rowPoints) {
      return []
    }
    return JSON.parse(rowPoints)
  }

  startHandler = () => this.setState({ active: true }, this.manualTriggerWatchPosition)
  

  stopHandler = (save = false) => () => {
    const donePath = [...this.state.historyPoints, ...this.state.currentPoints]
    const updatedState = {
      active: false,
      historyPoints: donePath,
      currentPoints: []
    }
    if (!save) {
      delete updatedState.historyPoints
    }
    if (save) {
      this.updateLocalstorage(donePath)
    }
    this.setState(updatedState)
  }
  renderWithAuth() {
    return (
      <Fullscreen
        enabled={false && this.state.active}
        onChange={isFull => this.setState({isFull})}
      >
        <Map
          outer={[
            {"lat":53.86052163377647,"lng":27.34381718063355},
            {"lat":54.02057519825325,"lng":27.33832401657105},
            {"lat":54.0286424276716,"lng":27.68439335250855},
            {"lat":53.870239334124754,"lng":27.82721561813355},
            {"lat":53.76484396689097,"lng":27.6047424736023}
          ]}
          points={[
            ...this.state.historyPoints, 
            ...this.state.currentPoints,
          ]}
          fixed = {this.state.active}
          focus = {this.state.active && this.state.currentPoints[this.state.currentPoints.length - 1]}
          blockSize = {this.state.size}
          orientationAngle = { this.state.alphaAngle}
        />
        <GUI
          active={this.state.active}
          stop={this.stopHandler(true)}
          start={this.startHandler}
          stopNoSave={this.stopHandler(false)}
        />
      </Fullscreen>
    )
  }
  renderAnonimous() {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          className='rotatable'
          src={Loading}
        />
      </div>
    )
  }
  render() {
    const { user } = this.state;

    if (true) {
      return this.renderWithAuth();
    }
    return this.renderAnonimous();
  }
}


export default App;
