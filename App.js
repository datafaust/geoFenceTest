//links for support


//https://stackoverflow.com/questions/60199774/expo-location-geofencing-not-working-on-standalone-devices-ios
//https://docs.expo.io/versions/latest/sdk/task-manager/
//https://www.youtube.com/watch?v=2NUUN0dX4kE
//https://stackoverflow.com/questions/59133892/expo-startgeofencingasync-not-starting



import { StyleSheet, Text, View, Button } from 'react-native';
import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';
const LOCATION_TASK_NAME2 = 'background-geofence';

class App extends Component {

state= {
  point : {latitude: 0, longitude: 0},
  hasLocationPermission: null,
  location: null
}

async componentDidMount() {
  this.getLocationsPermissions();
  //Permissions.askAsync(Permissions.LOCATION);
  //await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //accuracy: Location.Accuracy.Balanced,
  //});

  await Location.startGeofencingAsync(LOCATION_TASK_NAME2,[{
    latitude: 40.763882,
    longitude: -73.929893,
    radius: 50
   }]);

}



//update location points
getCurrentLoc = async () => {
  console.log('retrieving points');
  let location = await Location.getCurrentPositionAsync({});
  location =  await JSON.stringify(location);
  location = await eval( '(' + '[' + location + ']' + ')' );
  this.setState({ location: location })

}

//ask for location permissions 
getLocationsPermissions = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //status && console.log('location: ', status)
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
    } else {
      this.setState({ hasLocationPermission : status })
    }
}

_startGeofence = async () => {
  console.log('starting geofencing test ...')
  Location.startGeofencingAsync('geofence',
    [
    {
      latitude: 40.763882,
      longitude: -73.929893,
      radius: 50
     }
     ]
    );
  
};

_startLocationTrack = async () => {
  console.log('tracking location..')
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
  });

}




  render() {


    return (
      <View style={{marginTop :100}}>
        <Text>geofence test</Text>

        <Button 
          onPress={this._startLocationTrack}
          title="TRACK ME"
        />

        <Button 
          onPress={this._startGeofence}
          title="AM-I-IN-THE-REGION?"
        />
        <Text>{this.state.location ? `my current location is lat: ${this.state.location[0].coords.latitude}` : `none`}</Text>
      </View>
    );
  }
}

export default App;

TaskManager.defineTask(LOCATION_TASK_NAME2, ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log("You've entered region:", region);
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations);
    // do something with the locations captured in the background
  }
});