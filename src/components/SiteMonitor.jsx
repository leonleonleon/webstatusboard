import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './App.css';


/**
 * SiteMonitor Component
 */
export default class SiteMonitor extends Component {
    static propTypes = {
        url : PropTypes.string,
    };
    state = {
        loading : true,
        result  : null,
    }
    /**
     * componentDidMount -> check for data
     */
    componentDidMount() {
        const { result } = this.state;
        if ( result === null ) this.checkStatus();
    }
    /**
     * componentDidUpdate -> check for data
     */
    componentDidUpdate() {
        const { result } = this.state;
        if ( result === null ) this.checkStatus();
        else setTimeout( () => {
            this.setState( {
                result  : null,
                loading : true,
            } );
        }, 30000 );
    }
    /**
     * checkForWordpress
     *
     * @param {string} body
     *
     * @return {bool} returns true if can find wp link
     */
    checkForWordpress = ( body ) => {

        if ( body === undefined ) return false;

        const filter = 'wp-content';

        if ( body.includes( filter ) ) {
            return true;
        }

        return false;
    }

    /**
     * handleSubmit
     *
     */
    checkStatus = ( ) => {
        const { url } = this.props;
        const headers = new Headers();

        const config = {
            method  : 'GET',
            headers : headers,
            mode    : 'cors',
        };

        let fullurl = `/getstatus/${url}`;

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) {
            // dev code
            fullurl = `http://localhost:3000/getstatus/${url}`;
        }


        fetch( fullurl, config )
            .then( resp => resp.json() )
            .then(
                resp => {


                    const result = {
                        url       : url,
                        status    : resp.request.statusCode,
                        body      : resp.request.body,
                        date      : resp.request.headers.date,
                        duration  : resp.duration,
                        full      : resp,
                    };


                    const newState = {
                        loading : false,
                        result  : result,
                    };
                    this.setState( newState );
                } )
            .catch( error => console.error( error ) );
    }
    /**
     * react render
     * @return {object} React element
     */
    render() {
        const { loading, result } = this.state;
        const { url } = this.props;

        if ( loading ) {
            return <div className={ styles.SiteMonitor }>
                <div>requesting { url }...</div>
            </div>;
        }

        const wordpress = this.checkForWordpress( result.body ) ? 'W' : '';

        const colorClass = result.status === 200 ? styles.Green : styles.Red;

        const status = result.status === undefined ? result.full.request.code : result.status;

        const date = new Date( result.date ).toLocaleTimeString();

        return (
            <div
                className={ styles.SiteMonitor }
                onClick={ () => {
                    this.setState( {
                        loading : true,
                        result  : null,
                    } );
                } }
            >
                <div className={ styles.Result }>
                    <h2>{ result.url }</h2>
                    status&nbsp;&nbsp;&nbsp;: <span className={ colorClass }>{ status }</span><br />
                    checked&nbsp;&nbsp;: { date } <br />
                    duration&nbsp;: { result.duration } ms
                    <div className={ styles.Wordpress }>{ wordpress }</div>
                </div>
            </div>
        );
    }
}
