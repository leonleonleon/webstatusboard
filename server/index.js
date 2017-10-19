const path    = require( 'path' );
const express = require( 'express' );
const request = require( 'request' );
const app     = express();

const staticPath = path.resolve( __dirname, '../dist' );



app.use( express.static( staticPath ) );

app.use( ( req, res, next ) => {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    next();
}
);

const port = process.env.PORT || 3000;

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

// not found in static files, so default to index.html
app.use( ( req, res ) => res.sendFile( `${staticPath}/index.html` ) );



app.listen( port, () => {
    console.log( `Example app listening on port ${port}!` ); // eslint-disable-line
} );
