import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './App.css';
import SiteMonitor from './SiteMonitor.jsx';
import config from 'config/Settings.json';

/**
 * App Component
 */
export default class App extends Component {
    static propTypes = {

    };
    state = {
    }
    /**
     * react render
     * @return {object} React element
     */
    render() {
        console.warn( process.env.NODE_ENV );
        const urls = config.URLS;

        const sites = urls.map( ( url, index ) => {
            return <SiteMonitor url={ url } key={ index } />;
        } );

        return (
            <div className={ styles.App }>
                { sites }
            </div>
        );
    }
}
