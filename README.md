The meanest realtime task tracker
=============================
### You wouldn't like your app to be called "Todo app", right :)

### Using:
Angular, SockJS, Primus, Express, Node, Mongoose

### Screenshot:
![Screenshot-2014-06-02_14-54-30.png](Screenshot-2014-06-02_14-54-30.png)

## Installation
 - the easiest way to start a local MongoDB is with Docker, of course (if you opt to use it I'd assume you know how to deal with non-Linux environments and docker host):  
```docker run --name todoDB -d mongo```  
which will download MongoDB image from the Hub, start the container and make mongo listen on its default port, 27017  

*WARNING:* don't try to mount a host's volume inside a container, since there's an [outstanding VBox issue](https://www.virtualbox.org/ticket/819) with memory mapped files that Mongo wholeheartedly utilizes (and rightfully so). There's no point doing that for a demo setup anyway.

 - another option is to install MongoDB locally and start it (don't change the default port, 27017)
   - yet another opiton is to use the following MongoHQ (now [compose](https://www.compose.io/)) url in `server.js`: `mongodb://guest:pub@kahana.mongohq.com:10058/tasks`
 
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
 - use rocksdb/leveldb for persistence and client synchronization:
   - multilevel, level-live-stream, level-livefeed (streams2), level-trigger
 - use [PouchDB](http://pouchdb.com/) for local storage and synchronization
