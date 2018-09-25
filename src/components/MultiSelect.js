import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

var MultiSelect = createClass({
    displayName: 'MultiSelect',
    propTypes: {
        label: PropTypes.string,
    },
    getInitialState() {
        return {
            removeSelected: true,
            disabled: false,
            crazy: false,
            stayOpen: false,
            value: [],
            rtl: false,
        };
    },
    handleSelectChange(value) {
        this.setState({ value });
        this.props.onChange(value);
    },
    render() {
        const { disabled, stayOpen, value } = this.state;
        const options = this.props.options;
        // The drop down that will filter out what markers on the map and locations are in the list
        return (
            <Select
                closeOnSelect={!stayOpen}
                disabled={disabled}
                multi
                onChange={this.handleSelectChange}
                options={options}
                placeholder="Search..."
                removeSelected={this.state.removeSelected}
                rtl={this.state.rtl}
                simpleValue
                value={value}
            />
        );
    }
});
export default MultiSelect;