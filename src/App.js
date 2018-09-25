import React, { Component } from 'react';
import MultiSelect from './components/MultiSelect';
import ListItem from './components/ListItem';
import './App.css';

// constants
const KEY = 'AIzaSyDF--9UJbiRa5VgXbmO14t4q8HcUnjACSA';
const GOOGLE_URL = "https://maps.googleapis.com/maps/api/js?v=3&key="+KEY+"&callback=initMap";
const WIKI_URL = "https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=text&section=0";

// properties
var mapDefault = {
	zoom: 10,
	center: { // fort snelling
		lat: 44.783573,
		lng: -93.2295506,
	}
};

class App extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			map: null,
			currentOptions: null,
			// positions for landmarks
			locations: [{
				name: 'Minneapolis–Saint Paul International Airport, Terminal 1 & 2',
				wiki: 'Minneapolis–Saint_Paul_International_Airport',
				city: 'None',
				key: 0,
				location: {
					lat: 44.8847554, 
					lng: -93.22228459999997,
				},
				marker: null,
				infoWindow: null,
			},
			{
				name: 'University of Minnesota Twin Cities',
				wiki: 'University_of_Minnesota',
				city: 'Minneapolis',
				key: 1,
				location: {
					lat: 44.97399,
					lng: -93.22772850000001, 
				},
				marker: null,
				infoWindow: null,
			}, 
			{
				name: 'Minnesota Zoo',
				wiki: 'Minnesota_Zoo',
				city: 'Apple Valley',
				key: 2,
				location: {
					lat: 44.767807,
					lng: -93.19667179999999, 
				},
				marker: null,
				infoWindow: null,
			}, 
			{
				name: 'Minnesota State Capitol',
				wiki: 'Minnesota_State_Capitol',
				city: 'St. Paul',
				key: 3,
				location: {
					lat: 44.95515,
					lng: -93.10223300000001, 
				},
				marker: null,
				infoWindow: null,
			}, 
			{
				name: 'Mall of America',
				wiki: 'Mall_of_America',
				city: 'Bloomington',
				key: 4,
				location: {
					lat: 44.856691,
					lng: -93.24130939999998,
				},
				marker: null,
				infoWindow: null,
			}, 
			{
				name: 'Minnesota State Fairgrounds',
				wiki: 'Minnesota_State_Fair',
				city: 'Falcon Heights',
				key: 5,
				location: {
					lat: 44.981921,
					lng: -93.1731168, 
				},
				marker: null,
				infoWindow: null,
			}]
		}
		this.initMap = this.initMap.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	};

	// initialize the google map with infowindows of information from wikipedia,
	// by default, show all locations on map
	initMap() {
		var map = new window.google.maps.Map(document.getElementById('map'), mapDefault);
		
		var locations = this.state.locations;
		var index = 0;
		var co = [];
		
		locations.forEach (function(loc) {
			var myLatLng = {lat: loc.location.lat, lng: loc.location.lng};

			co.push(loc);
			var marker = new window.google.maps.Marker({
				position: myLatLng,
				map: map,
				title: loc.name
			});	
			
			// add information to windows and set in state for later usage
			var infoWindow = new window.google.maps.InfoWindow({ content: loc.name });

			var xhr = new XMLHttpRequest();

			xhr.open('GET', WIKI_URL+"&page="+loc.wiki);
			// CORS needs to be turned on, else this will not work.. an error can be set and told in the console or webpage
			
			xhr.onload = function(e){
				if (xhr.readyState === 4 && xhr.status === 200){
					try {
						var parseText = JSON.parse(xhr.responseText);
						var content = parseText.parse.text["*"];
					}
					catch (error) {
						// this error catches if the wiki page can be parsed
						console.log("problem with parsing wiki page: " + WIKI_URL+"&page="+loc.wiki);
						content = "<div><p>Content would be provided by Wikipedia if page was formatted correctly.</p>\n" +
							"<a href=\"https://en.wikipedia.org/wiki/"+loc.wiki+"\"></a>";
					}
					infoWindow.setContent("<p>from Wikipedia:</p>"+content);
				} else {
					console.log("status never came back from wiki page: " + WIKI_URL+"&page="+loc.wiki);
					content = "<div><p>Content would be provided by Wikipedia if page responded.</p>\n" +
							"<a href=\"https://en.wikipedia.org/wiki/"+loc.wiki+"\"></a>";
					infoWindow.setContent(content);
				}
				xhr.onerror = function(e){
					console.log("problem with accessing wiki page: " + WIKI_URL+"&page="+loc.wiki);
					content = "<div><p>"+xhr.statusText+"</p>\n" +
							"<a href=\"https://en.wikipedia.org/wiki/"+loc.wiki+"\"></a>";
					infoWindow.setContent(content);
				}
			}
			xhr.send();
			
			marker.addListener('click', function() {
				loc.infoWindow.open(map, marker);
			});
		
			marker.setMap(map);
			locations[index].marker = marker;
			locations[index].infoWindow = infoWindow;
			
			index++;
		});
		this.setState({ map: map, locations: locations, currentOptions: co });
	};
	
	// a change in the dropdown will filter what markers will be seen on the map and
	// what rows will display in the list
	onChange(index) {
		// remove markers on map
		var map = this.state.map;
		var co = [];
		var locations = this.state.locations;
		locations.forEach (function(loc) {
			if (loc.marker != null) {
				loc.marker.setMap(null);
				loc.marker = null;
			}
		});
		
		if (index !== null && index !== '') {
			var array = index.split(',');

			array.forEach (function(spot) {
				// create new marker based on drop down or list
				var loc = locations[spot];
				var myLatLng = {lat: loc.location.lat, lng: loc.location.lng};
			
				var marker = new window.google.maps.Marker({
					position: myLatLng,
					map: map,
					title: loc.name
				});
			
				marker.addListener('click', function() {
					loc.infoWindow.open(map, marker);
				});
			
				co.push(loc);
				loc.marker = marker;
				marker.setMap(map);
				locations[index] = loc;
			});
		}
		this.setState({ map: map, locations: locations, currentOptions: co });
	};
	
	// when the button to see more info is hit from the list, show infoWindow on map and 
	// animate the map marker
	handleClick(value) {
		var map = this.state.map;
		var marker = this.state.locations[value].marker;
		
		// bounce marker
		marker.setAnimation(window.google.maps.Animation.BOUNCE);

		// show infoWindow
		var loc = this.state.locations[value];
		loc.infoWindow.open(map, marker);
	}
	
	componentWillMount() {
		window.locations = {
			locations: this.state.locations
		};
	};
	
	componentDidMount() {
		// Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
		
		var ref = window.document.getElementsByTagName("script")[0];
		var script = window.document.createElement("script");
		script.src = GOOGLE_URL;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
		
		this.setState({ isLoading: false });
	};

	render() {
		var options = [
			{ label: this.state.locations[0].name, value: '0' },
			{ label: this.state.locations[1].name, value: '1' },
			{ label: this.state.locations[2].name, value: '2' },
			{ label: this.state.locations[3].name, value: '3' },
			{ label: this.state.locations[4].name, value: '4' },
			{ label: this.state.locations[5].name, value: '5' }
		]
		
		var items = [];
		
		if (this.state.currentOptions != null) {
			// create the list view of items here
			this.state.currentOptions.forEach (function(loc) {
				items.push({ key: loc.key, name: loc.name, city: loc.city });
			});
		}
		return (
			<div>
				<div className="dropdown">
					<MultiSelect 
						options={options}
						onChange={this.onChange}
					/>
				</div>
				<div className="listitem">
					<ul className="listitem">
						<li className="listitem">Destination</li>
						<li className="listitem">City</li>
						<li className="listitem">More Info</li>
					</ul>
					<ListItem 
						onClick={this.handleClick}
						options={items} 
					/>
				</div>
			</div>
		);

	}
}

export default App;