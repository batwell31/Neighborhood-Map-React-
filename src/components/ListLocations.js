import React, { Component } from 'react';
import PropTypes from 'prop-types'

class ListLocations extends Component {

    static propTypes = {
        map: PropTypes.object.isRequired,
        defaultIcon: PropTypes.object.isRequired,
        highlightedIcon: PropTypes.object.isRequired,
        infowindow: PropTypes.object.isRequired,
        markers: PropTypes.array.isRequired,
        mapMarkers: PropTypes.array.isRequired,
        addMarkers: PropTypes.func.isRequired,
        hideMarkers: PropTypes.func.isRequired,
        populateInfoWindow: PropTypes.func.isRequired
    }

    state = {
        query: '',
    }

    updateQuery = (event) => {
        this.setState({ query: event.target.value })
    }

    // reset all markers in the map to default icons.
    resetIcons = (mapMarkers, defaultIcon) => {
        mapMarkers.forEach(mapMarker => {
            mapMarker.setIcon(defaultIcon)
        })
    }

    render() {
        const { map, markers, mapMarkers, infowindow, defaultIcon, highlightedIcon, addMarkers, hideMarkers, populateInfoWindow } = this.props
        const { query } = this.state
        const filteredMapMarkers = mapMarkers.filter(mapMarker => mapMarker.title.toUpperCase().includes(query.toUpperCase()))
        const filteredMarkers = markers.filter(marker => marker.title.toUpperCase().includes(query.toUpperCase()))
        return (
            <div className='list-locations'>
                <form className='search-form' onSubmit={(e) => { hideMarkers(mapMarkers); addMarkers(map, filteredMarkers, infowindow); e.preventDefault() }} >
                    <input className='search-input' aria-label='search' type='text' value={query} placeholder='Attraction location' onChange={this.updateQuery} />
                    <input className='search-filter' type='submit' value='Filter' />
                </form>
                <ul>
                    {filteredMapMarkers.map(mapMarker => (
                        <li key={mapMarker.title} tabIndex='0' onClick={() => populateInfoWindow(mapMarker, infowindow, map)}
                            onMouseOver={() => mapMarker.setIcon(highlightedIcon)} onMouseOut={() => { mapMarker.setIcon(defaultIcon) }}
                            onFocus={() => { this.resetIcons(mapMarkers, defaultIcon); mapMarker.setIcon(highlightedIcon) }}
                            onKeyPress={(event) => { if (event.key === 'Enter') populateInfoWindow(mapMarker, infowindow, map) }} >
                            {mapMarker.title}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default ListLocations
