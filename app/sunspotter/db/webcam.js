const sqlite = require("./aa-sqlite");

var webcam = function() {};
webcam.tablename = 'webcam';

webcam.init = async function() {
    try {
        var r = await sqlite.run(`DROP TABLE ${this.tablename}`);
        if(r) console.log(`Table ${this.tablename} dropped`)
    } catch(err) {
        console.log(`Can't drop table ${this.tablename}: ` + err);
    }
    
    var r = await sqlite.run(`CREATE TABLE ${this.tablename}(ID integer NOT NULL PRIMARY KEY, webcamid text, title text, lat number, long number, imgurl text)`);
    if(r) console.log(`Table ${this.tablename} created`)
}

webcam.insert = async function insert(id, webcamid, title, lat, long, imgurl) {
    var entry = `'${id}','${webcamid}','${title}',${lat},${long},'${imgurl}'`;
    var sql = `INSERT INTO ${this.tablename}(ID, webcamid, title, lat, long, imgurl) VALUES (` + entry + `)`;
    r = await sqlite.run(sql)
    if(r) console.log(`${this.tablename} entry inserted: ${entry}`);
}

webcam.getAllWhereTitleIsSetAndNotGeocoded = async function() {
    sql = `SELECT * FROM ${this.tablename} WHERE title != '' AND lat = 0 AND long = 0`;
    r = await sqlite.all(sql, []);
    return r;
}

webcam.getAll = async function() {
    sql = `SELECT * FROM ${this.tablename} ORDER by title`;
    r = await sqlite.all(sql, []);
    return r;
}

webcam.updateLatLong = async function(id, lat, long) {
    var sql = `UPDATE ${this.tablename} SET lat = ${lat}, long = ${long} WHERE ID = ${id}`;
    r = await sqlite.run(sql)
    if(r) console.log(`${this.tablename} entry updated with lat,long: ${id}, Lat:${lat}, Long:${long}`);
}

module.exports = webcam;