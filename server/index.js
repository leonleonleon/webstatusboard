const path          = require( 'path' );
const express       = require( 'express' );
const request       = require( 'request' );
// const fs            = require( 'fs' );
const low           = require( 'lowdb' );
const FileSync      = require( 'lowdb/adapters/FileSync' );
const bodyParser    = require( 'body-parser' );

const app           = express();

const staticPath = path.resolve( __dirname, '../dist' );

// const jsonPath = `${staticPath}/Settings.json`;

// Json DB setup
const adapter = new FileSync( 'db.json' );
const db = low( adapter );

db.defaults( {
    'user'  : '#0',
    'sites' : [ {
        'name' : 'Google',
        'url'  : 'google.de',
    } ] } ).write();

// Server and routing stuff

app.use( express.static( staticPath ) );

app.use( ( req, res, next ) => {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    next();
}
);

const port = process.env.PORT || 3000;

// Enable POST body parsing
app.use( bodyParser.json() );

// Get Status of Site
app.get( '/getstatus/:url', ( req, res, next ) => {
    const url = `http://${req.params.url}`;

    const startRequest = Date.now();

    // Comment out this line:
    //res.send('respond with a resource');
    request( url, ( err, response, body ) => {
        // if ( err || response.statusCode !== 200 ) {
        //     return res.sendStatus( 500 );
        // }
        const endRequest = Date.now();

        const passedTime = endRequest - startRequest;

        const safeResp = response === undefined ? err : response;
        res.json( {
            'url'      : url,
            'duration' : passedTime,
            'params'   : req.params,
            'request'  : safeResp,
        } );
    } );
    // And insert something like this instead:
} );


// Load ALL Settings
app.get( '/loadSettings', ( req, res, next ) => {

    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );

    res.json( db );
} );

// Add Site
app.post( '/addSite', ( req, res, next ) => {

    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );

    if ( req.body != undefined ) {
        console.log( 'settings', app.locals.settings ); // eslint-disable-line

        const newSite = req.body;

        db.get( 'sites' )
            .push( newSite )
            .write( );

        res.json( { status : 'recieved data' } );
    } else {
        res.json( { status : 'error' } );
    }
} );

// Remove Site
app.post( '/removeSite', ( req, res, next ) => {

    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );

    if ( req.body != undefined ) {


        const removeSite = req.body;

        db.get( 'sites' )
            .remove( { url : removeSite.url } )
            .write( );
        res.json( { status : 'recieved data' } );
    } else {
        res.json( { status : 'error' } );
    }
} );

// not found in static files, so default to index.html
app.use( ( req, res ) => res.sendFile( `${staticPath}/index.html` ) );



app.listen( port, () => {
    console.log( `Example app listening on port ${port}!\n` ); // eslint-disable-line
} );

