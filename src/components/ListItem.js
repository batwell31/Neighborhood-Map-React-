import React, { Component } from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Item from './Item';
import './../App.css';

var ListItem = createClass({
    displayName: 'ListItem',
    propTypes: {
        label: PropTypes.string,
    },
    handleClick(value) {
        this.props.onClick(value);
    },
    render() {
        if (this.props.options != null && this.props.options.length > 0) {

            // display the list of items here
            const listItems = this.props.options.map((loc) =>
                <Item
                    onClick={this.handleClick}
                    key={loc.key}
                    options={loc} />
            );

            return (
                <div>{listItems}</div>
            );
        }
        else {
            // empty so nothing to display
            return (<div></div>);
        }
    }
});
export default ListItem;