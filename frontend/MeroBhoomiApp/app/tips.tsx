import React, {useState, useEffect} from 'react';
import MapView , {Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions, Button , Alert} from 'react-native';
import * as Location from 'expo-location';
import { Text, TextInput } from 'react-native-paper';


export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [location, setLocation ] =useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ searchQuery, setSearchQuery ] = useState('');

  const userLocation = async () =>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
    }


    const hangleMarkerDragEnd = (e: any) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,

      });
      console.log("After marker change");
      console.log(latitude, longitude);

    };

    const searchLocation = async() =>{
      try {
        const geocodeResult = await Location.geocodeAsync(searchQuery);

        if(geocodeResult.length > 0){
          const {latitude, longitude} = geocodeResult[0];
          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
        }
        else{
          Alert.alert('No loaction found.');
        }
        } catch(err){
          console.error(err);
          Alert.alert('Error occured while searching.');
        }
    }
    useEffect(() => {
      userLocation();
    }, []);

  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search for a place'
        value = {searchQuery}
        onChangeText={setSearchQuery}
      >
      </TextInput>

      <Button title='Search' onPress={searchLocation}></Button>
      <MapView style={styles.map} 
        region = {mapRegion}
      >
        <Marker 
          coordinate = {mapRegion} 
          title='Marker'
          draggable
          onDragEnd={hangleMarkerDragEnd}
        >

        </Marker>
      </MapView>

      <Button title='Get Location' onPress={userLocation}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchInput: {
    height: 40,
    margin: 8,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 20
  }
});
