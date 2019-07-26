
'use strict';

const Hapi = require('@hapi/hapi');

require('dotenv').config();

import { rpc } from './lib/jsonrpc';

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    });

    server.route({

      method: 'POST',

      path: '/',

      config: {

        handler: async (req, h) => {

					var result;

          let payload = JSON.parse(Object.keys(req.payload)[0]);

          console.log(payload);

          var params = payload.params;

          if (payload.method === 'getbalance') {

            params = [];

          }

          if (payload.method === 'sendfrom') {

            payload.method = 'sendtoaddress';

            params = [payload.params[1], payload.params[2]];

          }
	    
          result = await rpc.call(payload.method, params, payload.id);

          console.log('result', result);

          return result;

        }

      }

    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
