const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cluster0-dgwzq.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',
    {useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongodb !');
});
