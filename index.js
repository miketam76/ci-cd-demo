const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World from CI/CD demo!');
    res.send("Added this line");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
