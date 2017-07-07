# Split Saver Server

### Deploying To Production
1) ```heroku git:remote -a split-saver``` (Connect Heroku App onto git)
2) ```git push heroku master``` (Push subtree to Heroku)

### Setup Local DB
We will be using Mongo
1) ```brew install mongodb```
2) ```mkdir -p /data/db```
3) ```mongod --port 27017```

