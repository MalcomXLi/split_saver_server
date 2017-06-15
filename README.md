# Split Saver Server
Server its 4lit
Note when working on server side tasks you want to develop on this repo, then switch to the [split_saver repo](https://github.com/MalcomXLi/split_saver)
to deploy to prod 
### Deploying To Production
1) ```git pull -s subtree server master``` (Command to update server subtree)
2) ```git subtree push --prefix server heroku master``` (Push subtree to Heroku)

### Setup Local DB
We will be using Mongo
1) ```brew install mongodb```
2) ```mkdir -p /data/db```
3) ```mongod --port 27017```

