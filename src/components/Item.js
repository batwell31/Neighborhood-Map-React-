import React, { Component } from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import './../App.css';

var Item = createClass({
    displayName: 'Item',
    propTypes: {
        label: PropTypes.string,
    },
    getInitialState() {
        return {
            value: [],
        };
    },
    handleClick() {
        var key = this.props.options.key;
        this.props.onClick(key);
    },
    render() {
        if (this.props.options != null) {
            var name = this.props.options.name;
            var city = this.props.options.city;
            // use the ul and li tags for creating rows and columns in the view
            return (
                <div className="row">
                    <ul className="listitem">
                        <li className="listitem">{name}</li>
                        <li className="listitem">{city}</li>
                        <li className="listitem">
                            <input type="button"

                                value="Information"
                                onClick={this.handleClick}
                            />
                        </li>
                    </ul>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }
});
export default Item;
