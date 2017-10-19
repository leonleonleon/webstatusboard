import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './App.css';
import SiteMonitor from './SiteMonitor.jsx';
// import config from 'config/Settings.json';
import AddSite from './AddSite.jsx';
/**
 * App Component
 */
export default class App extends Component {
    static propTypes = {

    };
    state = {
        loading  : false,
        location : 'default',
        settings : null,
    }
    /**
     * fetch Settings on Mount
     */
    componentDidMount() {
        const { settings, loading } = this.state;
        if ( settings === null && !loading ) {
            this.fetchSettings();
        }
    }
    /**
     * fetchSettings
     *
     */
    fetchSettings = ( ) => {
        this.setState( { loading : true } );
        const headers = new Headers( { 'Accept' : 'application/json' } );

        const config = {
            method  : 'GET',
            headers : headers,
            mode    : 'cors',
        };

        let fullurl = '/loadSettings';

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) {
            // dev code
            fullurl = 'http://localhost:3000/loadSettings';
        }


        fetch( fullurl, config )
            .then( resp => resp.json() )
            .then(
                json => {
                    console.log( 'json', json );

                    const newState = {
                        loading   : false,
                        settings  : json,
                    };
                    this.setState( newState );
                } )
            .catch( error => console.error( error ) );
    }
    /**
     * addSite
     *
     * @param {object} newSite
     *
     */
    addSite = ( newSite ) => {
        const { settings } = this.state;

        const headers = new Headers( {
            'Accept'       : 'application/json',
            'Content-Type' : 'application/json',
        } );
        console.log( JSON.stringify( newSite ) );

        const config = {
            method  : 'post',
            headers : headers,
            mode    : 'cors',
            body    : JSON.stringify( newSite ),
        };

        let fullurl = '/addSite';

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) {
            // dev code
            fullurl = 'http://localhost:3000/addSite';
        }


        fetch( fullurl, config )
            .then( resp => resp.json() )
            .then(
                json => {
                    console.log( json );

                    const newSettings = settings;

                    newSettings.sites.push( newSite );

                    this.setState( {
                        location : 'default',
                        settings : newSettings,
                    } );
                } )
            .catch( error => console.error( error ) );
    }
    /**
     * removeSite
     *
     * @param {object} removeSite
     *
     */
    removeSite = ( removeSite ) => {

        const headers = new Headers( {
            'Accept'       : 'application/json',
            'Content-Type' : 'application/json',
        } );

        const config = {
            method  : 'post',
            headers : headers,
            mode    : 'cors',
            body    : JSON.stringify( removeSite ),
        };

        let fullurl = '/removeSite';

        if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) {
            // dev code
            fullurl = 'http://localhost:3000/removeSite';
        }


        fetch( fullurl, config )
            .then( resp => resp.json() )
            .then(
                json => {
                    const { settings } = this.state;


                    const newSites = settings.sites.filter( ( site ) => {
                        return site != removeSite;
                    } );

                    const newSettings = settings;
                    newSettings.sites = newSites;


                    this.setState( {
                        settings : newSettings,
                    } );
                } )
            .catch( error => console.error( error ) );
    }
    /**
     * react render
     * @return {object} React element
     */
    render() {
        const { loading, settings, location } = this.state;

        if ( loading || settings === null ) {
            return <div className={ styles.App }>
                loading settings...
            </div>;
        }

        if ( location === 'add' ) {
            return (
                <div className={ styles.App }>
                    <AddSite addSite={ this.addSite } />
                </div>
            );
        }

        const sites = settings.sites;

        const sitesElements = sites.map( ( item, index ) => {
            return <SiteMonitor
                site={ item }
                key={ `${index}${item.name}` }
                remove={ this.removeSite }
            />;
        } );

        return (
            <div className={ styles.App }>
                <div className={ styles.Menu }>
                    <div className={ styles.Logo }>
                        { settings.user } DASHBOARD
                    </div>
                    <div
                        className={ styles.MenuButton }
                        onClick={ () => { this.setState( { location : 'add' } ); } }
                    >
                        Add Site
                    </div>
                </div>
                { sitesElements }
            </div>
        );
    }
}
