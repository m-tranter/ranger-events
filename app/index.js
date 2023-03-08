
const express = require('express');
const path = require('path');

const app = express();
const dir = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;

app.listen(port, (error) =>{
	if(!error)
		console.log(`Server is running on port ${port}`);
	else
		console.log(error);
	}
);

app.use(express.static(dir));