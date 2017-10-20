import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './App.css';

/**
 * AddSite Component
 */
export default class AddSite extends Component {
    static propTypes = {
        addSite     : PropTypes.func,
        location    : PropTypes.string,
    };
    state = {
        name : '',
        url  : '',
        last : 'name',
    }
    /**
     * handleChange
     * @param {object} event
     */
    handleChange = ( event ) => {
        // this.setState( { value : event.target.value } );
        const target = event.target;
        const value = target.value;
        const name = target.name === 'username' ? 'name' : 'name';
        const last = target.name;

        this.setState( {
            [ name ] : value,
            last     : last,
        } );
    }
    /**
     * handleSubmit
     * @param {object} event
     */
    handleSubmit = ( event ) => {
        event.preventDefault();

        const name = event.target.username.value;
        const url = event.target.url.value;

        if ( name.length > 0 && url.length > 0 ) {
            const newSite = {
                name : name,
                url  : url,
            };
            this.props.addSite( newSite );
        }
    }
    /**
     * component did mount
     */
    componentDidUpdate() {
        // console.log( 'update' );
        // const { last } = this.state;
        // if ( last === 'name' ) this.nameInput.focus();
        // else this.urlInput.focus();
    }
    /**
     * render
     * @return {jsx} element
     */
    render() {
        const { location } = this.props;
        // const { last } = this.state;

        if ( location != 'add' ) return null;

        // const lastInput = document.getElementsByName( last )[ 0 ];
        // if ( lastInput != undefined ) lastInput.focus();

        return (
            <form onSubmit={ this.handleSubmit } className={ styles.Form } key="addForm">
                <span>
                    name : <input
                        id="NameInput"
                        key="inputName"
                        type="text"
                        name="username"
                    />
                </span>
                <span>
                    &nbsp;url : <input
                        id="UrlInput"
                        key="inputUrl"
                        type="text"
                        name="url"
                    />
                </span>
                <span>
                    &nbsp;<input type="submit" value="add" className={ styles.Submit } />
                </span>
            </form>
        );
    }
}
