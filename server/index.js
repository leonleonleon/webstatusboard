const path          = require( 'path' );
const express       = require( 'express' );
const request       = require( 'request' );
const fs            = require( 'fs' );
const bodyParser    = require( 'body-parser' );

const app           = express();

const staticPath = path.resolve( __dirname, '../dist' );

const jsonPath = `${staticPath}/Settings.json`;

app.locals = {
    settings : {},
};

// Check for Settings.json on Start

fs.stat( jsonPath,  ( err, stats ) => {

    // If File does not exist -> create!
    if ( stats === undefined ) {

        console.log( `Couldnt find ${jsonPath}\n` );  // eslint-disable-line

        const defaultJson = {
            user  : '#0',
            sites : [ {
                name : 'Google',
                url  : 'google.de',
            } ],
        };

        fs.writeFile( jsonPath, JSON.stringify( defaultJson ), ( err ) => {
            if ( err ) {
                console.log( err );  // eslint-disable-line
            }

            console.log( `${jsonPath} created!\n` );  // eslint-disable-line
        } );
    } else {
        // IF exists -> Read and safe in settings
        fs.readFile( jsonPath, 'utf8', ( err, data ) => {
            if ( err ) throw err;
            app.locals.settings = JSON.parse( data );
            console.log( 'added to locals' );
        } );
    }
} );

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

    fs.readFile( jsonPath, 'utf8', ( err, data ) => {
        if ( err ) {
            console.log( err ); // eslint-disable-line
        }
        console.log( `serving ${jsonPath}\n` ); // eslint-disable-line
        res.send( data );
    } );
} );

// Add Site
app.post( '/addSite', ( req, res, next ) => {

    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );

    if ( req.body != undefined ) {
        console.log( 'settings', app.locals.settings ); // eslint-disable-line

        const newSettings = app.locals.settings;
        const newSite = req.body;

        newSettings.sites.push( newSite );

        fs.writeFile( jsonPath, JSON.stringify( newSettings ), ( err ) => {
            if ( err ) {
                console.log( err );  // eslint-disable-line
            }

            console.log( `${jsonPath} updated!\n` );  // eslint-disable-line
        } );
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

        const array = app.locals.settings.sites;

        const newSites = array.filter( ( site ) => {
            return site.name != removeSite.name && site.url != removeSite.url;
        } );

        const newSettings = { sites : newSites };

        fs.writeFile( jsonPath, JSON.stringify( newSettings ), ( err ) => {
            if ( err ) {
                console.log( err );  // eslint-disable-line
            }
            console.log( `${removeSite.name} deleted!\n` );  // eslint-disable-line
            console.log( `${jsonPath} updated!\n` );  // eslint-disable-line
        } );
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

