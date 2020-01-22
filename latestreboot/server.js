var net = require('net');

var  data = {'user':'varun','pwd':'password1','path':'/restart'};


            console.log("Data is "+ JSON.stringify(data));
            var server = net.createConnection(3200, 'localhost');
            server.on('connect', function() {
                console.log("Conected");
                server.write(JSON.stringify(espressoObj));            
            });

            server.setKeepAlive(true);
            server.setNoDelay(true);
            server.on('error', function(err) {
                log('rboxConnect : Error ' + err);
                //i will try next time
                
            });
            server.on('data', function(data) {
                log('rbox Connect : RESPONSE '+ data);
            
            });                    
                
            server.destroy();