import React from 'react';
import App from 'components/App.jsx';
import { render } from 'react-dom';

// for older browsers:
import 'babel-polyfill';


render( <App someThing="some string" />, document.querySelector( '#app' ) );
