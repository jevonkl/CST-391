import { Meme } from "../models/Meme";
import { Caption } from "../models/Caption";
import { MemeQuality } from "../models/MemeQuality";
import * as mysql from "mysql";
import * as util from "util";

export class MusicDAO
{
    private host:string = "";
    private port:number = 3306;
    private username:string = "";
    private password:string = "";
    private schema:string = "MEME";
    private pool = this.initDbConnection();

    /**
     * Non-default constructor.
     *
     * @param host Database Hostname
     * @param username Database Username
     * @param password Database Password
     */
    constructor(host:string, port:number, username:string, password:string)
    {
        // Set all class properties
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.pool = this.initDbConnection();
    }

   /**
     * CRUD method to return all Artists.
     *
     * @param callback Callback function with an Array of type Artist.
     */
    public findCaption(callback: any)
    {
        // List of Artist to return
        let caption:Caption[] = [];

        // Get a pooled connection to the database, run the query to get all the distinct Artists, and return the List of Artists
        this.pool.getConnection(function(err:any, connection:any)
        {
            // Throw error if an error
            if (err) throw err

            // Run query
            connection.query('SELECT distinct CAPTION FROM MEME', function (err:any, rows:any, fields:any)
            {
                // Release connection in the pool
                connection.release();

                // Throw error if an error
                if (err) throw err

                // Loop over result set and save the Artist Name in the List of Artists
                for(let x=0;x < rows.length;++x)
                {
                    caption.push(new Caption(x, rows[x].CAPTION));
                }

                // Do a callback to return the results
                callback(caption);
            });

        });
     }

     /**
     * CRUD method to return all Memes for a caption associated.
     *
     * @param caption Name of the Caption to retrieve Memes for.
     * @param callback Callback function with an Array of type Meme.
     */
    public findMeme(caption:string, callback: any)
    {
         // List of Meme to return
         let meme:Meme[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes for specific Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM MEME WHERE CAPTION=? ORDER BY ID, TITLE', [caption]);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let memeId = result1[x].ID;
                let caption:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [memeId]);
                for(let y=0;y < result2.length;++y)
                {
                    caption.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Caption to the list
                meme.push(new Meme(result1[x].ID, result1[x].MEMENAME, result1[x].MEMEQUALITY));
            }

            // Do a callback to return the results
            callback(meme);
         });
    }

    /**
     * CRUD method to return all Memes.
     *
     * @param callback Callback function with an Array of type Meme.
     */
    public findAllMemes(callback: any)
    {
         // List of Meme to return
         let meme:Meme[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM MEME ORDER BY TITLE');
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let memeId = result1[x].ID;
                let tracks:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [memeId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Captions to the list
                meme.push(new Meme(result1[x].ID, result1[x].MEMENAME, result1[x].MEMEQUALITY));
            }

            // Do a callback to return the results
            callback(meme);
         });
    }

    /**
     * CRUD method to searches for all Memes by a wildard search in Artist.
     *
     * @param search wildcard Artist to search Memes for.
     * @param callback Callback function with an Array of type Meme.
     */
    public findMemesByCaption(search:string, callback: any)
    {
         // List of Memes to return
         let meme:Meme[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes for search partial Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM MEME WHERE CAPTION LIKE ? ORDER BY TITLE", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let memeId = result1[x].ID;
                let captions:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [memeId]);
                for(let y=0;y < result2.length;++y)
                {
                    captions.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Captions to the list
                meme.push(new Meme(result1[x].ID, result1[x].MEMENAME, result1[x].MEMEQUALITY));
            }

            // Do a callback to return the results
            callback(meme);
         });
    }

        /**
     * CRUD method to searches for all Memes by a wildcard serach in Description.
     *
     * @param search wildcard Description to search Memes for.
     * @param callback Callback function with an Array of type Meme.
     */
    public findMemesByDescription(search:string, callback: any)
    {
         // List of Memes to return
         let meme:Meme[] = [];

        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes for search partial Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM MEME WHERE MEMENAME LIKE ? ORDER BY MEMEQUALITY", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
                let memeId = result1[x].ID;
                let tracks:Caption[] = [];
                let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [memeId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Caption(result2[y].ID, result2[y].TITLE));
                }

                // Add Meme and its Captions to the list
                meme.push(new Meme(result1[x].ID, result1[x].MEMENAME, result1[x].MEMEQUALITY));
            }

            // Do a callback to return the results
            callback(meme);
         });
    }

    /**
     * CRUD method to return an Rank.
     *
     * @param memeId Meme ID to retrieve Meme for.
     * @param callback Callback function with an Array of type Meme.
     */
    public findRank(memeId:number, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Memes for specific Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM MEME WHERE ID=?', [memeId]);
            if(result1.length != 1)
                callback(null);

            // Use Promisfy Util to make an async function and run query to get all Captions for this Meme
            let captions:Caption[] = [];
            let result2 = await connection.query('SELECT * FROM CAPTION WHERE ID=?', [memeId]);
            for(let y=0;y < result2.length;++y)
            {
                captions.push(new Caption(result2[y].ID, result2[y].TITLE));
            }

            // Create an Meme and its Captions for return
            let meme = new Meme(result1[0].ID, result1[0].MEMENAME, result1[0].MEMEQUALITY);

            // Do a callback to return the results
            callback(meme);
         });
    }

    /**
     * CRUD method to create an Meme.
     *
     * @param meme Meme to insert.
     * @param callback Callback function with -1 if an error else Meme ID created.
     */
    public create(meme:Meme, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and insert Meme
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('INSERT INTO MEME (MEMENAME, MEMEQUALITY) VALUES(?,?)', [meme.MemeName, meme.MemeQuality]);
            if(result1.affectedRows != 1)
               callback(-1);

            // Use Promisfy Util to make an async function and run query to insert all Captions for this Meme
            let captionId = result1.insertId;
            for(let y=0;y < meme.MemeName.length;++y)
            {
                let result2 = await connection.query('INSERT INTO CAPTION (ID, TITLE, CAPTION) VALUES(?,?,?)', [meme, meme.MemeName[y].toString]);
            }

            // Do a callback to return the results
            callback(captionId);
        });
    }

    /**
     * CRUD method to update an Meme.
     *
     * @param meme Meme to update.
     * @param caption caption to update
     * @param callback Callback function with number of rows updated.
     */


     /**
     * CRUD method to delete an Meme.
     *
     * @param meme Meme ID to delete.
     * @param callback Callback function with number of rows deleted.
     * */
    public delete(memeId:number, callback: any)
    {
        // Get pooled database connection and run queries
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
           if (err) throw err;

            // Use Promisfy Util to make an async function and run query to delete the tracks for an Meme
            let changes = 0;
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('DELETE FROM CAPTION WHERE ID=?', [memeId]);
            changes = changes + result1.affectedRows;

            // Use Promisfy Util to make an async function and run query to delete the Meme
            let result2 = await connection.query('DELETE FROM MEME WHERE ID=?', [memeId]);
            changes = changes + result2.affectedRows;

            // Do a callback to return the results
            callback(changes);
        });
    }

    //* **************** Private Helper Methods **************** */

    /**
     * Private helper method to initialie a Database Connection
     */
    private initDbConnection():any
    {
        return mysql.createPool({host: this.host, port: this.port, user: this.username, password: this.password, database: this.schema, connectionLimit: 10});
    }
}
