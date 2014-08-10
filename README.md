The meanest realtime task tracker
=============================
### You wouldn't like your app to be called "Todo app", right :)

### Using:
Angular, SockJS, Primus, Express, Node, Mongoose

### Screenshot:
![Screenshot-2014-06-02_14-54-30.png](Screenshot-2014-06-02_14-54-30.png)

## Installation
 - install MongoDB and start it (on default port, 27017)
   - alternatively, you can use the following MongoHQ url in `server.js`: `mongodb://guest:pub@kahana.mongohq.com:10058/tasks`
 - git clone this repo
 - `cd` to the project's root and fire:
   - `npm install`
   - `bower install`
   - `node server.js` starts the server
 - then open [http://localhost:3000](http://localhost:3000) on couple of browser tabs (don't use IE)

## To do:
 - drag and drop tasks to reorder them (inside the category)
 - ~~enable task deletion~~
 - add label with task counter for each category (Active, On hold, Complete)

## Alternative implementations:
 - use leveldb for persistence and client synchronization:
   - multilevel, level-live-stream, level-livefeed (streams2), level-trigger
