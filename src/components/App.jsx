import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './App.css';

/**
 * App Component
 */
export default class App extends Component {
    static propTypes = {

    };
    state = {
        url     : 'google.de',
        loading : false,
        result  : '',
    }
    /**
     * checkForWordpress
     *
     * @param {string} body
     *
     * @return {bool} returns true if can find wp link
     */
    checkForWordpress = ( body ) => {

        const filter = 'wp-content';

        if ( body.includes( filter ) ) {
            return true;
        }

        return false;
    }

    /**
     * handleSubmit
     *
     * @param {object} event
     */
    handleSubmit = ( event ) => {
        event.preventDefault();
        const { url } = this.state;

        const headers = new Headers();

        const config = {
            method  : 'GET',
            headers : headers,
            mode    : 'cors',
        };
        this.setState( { loading : true } );

        const fullurl = `http://localhost:3000/getstatus/${url}`;

        fetch( fullurl, config )
            .then( resp => resp.json() )
            .then(
                resp => {
                    console.log( resp );

                    const wordpress = this.checkForWordpress( resp.request.body );

                    const result = `url : ${resp.url} status : ${resp.request.statusCode} wordpress : ${wordpress}`;

                    const newState = {
                        loading : false,
                        result  : result,
                    };

                    this.setState( newState );
                } )
            .catch( error => console.error( error ) );
    }
    /**
     * handleChange
     *
     * @param {object} event
     */
    handleChange = ( event ) => {
        this.setState( { url : event.target.value } );
    }
    /**
     * react render
     * @return {object} React element
     */
    render() {
        const { loading, result } = this.state;

        if ( loading ) {
            return <div>loading</div>;
        }

        return (
            <div className={ styles.App }>
                <div className={ styles.Form }>
                    <form onSubmit={ this.handleSubmit }>
                        <label>
                            http://
                            <input
                                type="text"
                                value={ this.state.url }
                                onChange={ this.handleChange }
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div className={ styles.Result }>
                    { result }
                </div>
            </div>
        );
    }
}
