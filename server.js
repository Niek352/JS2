const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/catalogData', (req, res) => {
  	fs.readFile('catalog.json', 'utf8', (err, data) => {
    	res.send(data);
  	});
});

app.post('/addToCart', (req, res) => {
  	fs.readFile('cart.json', 'utf8', (err, data) => {

    	var cart = JSON.parse(data);
    	const item = req.body;
      

    	fs.writeFile('cart.json', JSON.stringify(item, "", 4), (err) => {
      		if (err) {
          		res.send('{"result": 0}');
        	} else {
          		res.send('{"result": 1}');
        	}    	
    	});
  	});
});

app.listen(3000, function() {
  console.log('server is running on port 3000!');
});