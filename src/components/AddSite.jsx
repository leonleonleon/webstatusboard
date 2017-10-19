import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './App.css';

/**
 * AddSite Component
 */
export default class AddSite extends Component {
    static propTypes = {
        addSite     : PropTypes.func,
    };
    state = {
        name : '',
        url  : '',
    }
    /**
     * handleChange
     * @param {object} event
     */
    handleChange = ( event ) => {
        // this.setState( { value : event.target.value } );
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState( {
            [ name ] : value,
        } );
    }
    /**
     * handleSubmit
     * @param {object} event
     */
    handleSubmit = ( event ) => {
        event.preventDefault();
        const { name, url } = this.state;

        if ( name.length > 0 && url.length > 0 ) {
            const newSite = {
                name : name,
                url  : url,
            };
            this.props.addSite( newSite );
        }
    }
    /**
     * render
     * @return {jsx} element
     */
    render() {
        return (
            <form onSubmit={ this.handleSubmit } className={ styles.Form }>
                <label>
                    name : <input
                        type="text"
                        name="name"
                        value={ this.state.name }
                        onChange={ this.handleChange }
                    /><br />
                    url :&nbsp;&nbsp;<input
                        type="text"
                        name="url"
                        value={ this.state.url }
                        onChange={ this.handleChange }
                    /><br />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
