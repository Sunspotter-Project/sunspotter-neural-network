import sqlite from './aa-sqlite.mjs';

var prediction = function() {};
prediction.tablename = 'prediction';

prediction.init = async function() {
    try {
        var r = await sqlite.run(`DROP TABLE ${this.tablename}`);
        if(r) console.log(`Table ${this.tablename} dropped`)
    } catch(err) {
        console.log(`Can't drop table ${this.tablename}: ` + err);
    }
    
    var r = await sqlite.run(`CREATE TABLE ${this.tablename}(ID integer NOT NULL PRIMARY KEY, fkwebcam integer, result number, imgurl text, timestamp text)`);
    if(r) console.log(`Table ${this.tablename} created`)
}

prediction.drop = async function() {
    try {
        var r = await sqlite.run(`DROP TABLE ${this.tablename}`);
        if(r) console.log(`Table ${this.tablename} dropped`)
    } catch(err) {
        console.log(`Can't drop table ${this.tablename}: ` + err);
    }
}

prediction.insert = async function insert(id, fkwebcam, result, imgurl, timestamp) {
    var entry = `'${id}','${fkwebcam}',${result},'${imgurl}',${timestamp}`;
    var sql = `INSERT INTO ${this.tablename}(ID, fkwebcam, result, imgurl, timestamp) VALUES (` + entry + `)`;
    r = await sqlite.run(sql)
    if(r) console.log(`${this.tablename} entry inserted: ${entry}`);
}

prediction.getAll = async function() {
    var r = [];
    var sql = `SELECT * FROM ${this.tablename}`;
    try {
        r = await sqlite.all(sql, []);
    } catch (err) {
        console.error("Prediction.getAll error: " + err);
        r = [];
    }
    return r;
}

export default prediction;