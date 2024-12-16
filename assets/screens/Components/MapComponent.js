import MapView, {Marker} from 'react-native-maps';


export default function MapComponent() {
    return(
    <MapView style={{width:'100%', height:'100%'}} region={{latitude:59.8597558, longitude:17.6343904, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}>
        <Marker coordinate={{latitude:59.8597558, longitude:17.6343904}} title='Marker'/>
    </MapView>
    )
}