const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const config = require('./config')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const port = 3001



/**
 * Hakee tuotteet
 */
app.get('/products', async (req, res) => {
    try {
        const connection = await mysql.createConnection(conf);

        const category = req.query.category;

        let result;        

        if(category){
            result = await connection.execute("SELECT id, name as productName, price, image as imageUrl, category_id as category FROM product WHERE category_id=?", [category]);
        }else{
            result = await connection.execute("SELECT id, name as productName, price, image as imageUrl, category_id as category FROM product");
        }
        
        //First index in the result contains the rows in an array
        res.json(result[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Tuo tuotteiden kategoriat
 */
app.get('/categories', async (req, res) => {

    try {
        const connection = await mysql.createConnection(conf);

        const [rows] = await connection.execute("SELECT id, name as categoryName FROM category");

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Hakee kaikki tiedot taulusta tuotteet
 * */

app.get("/",async function (req,res) {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute("select * from item")

        if (!result) result=[]

        res.status(200).json(result)
    } catch(err) {
        res.status(500).send(err.message)
    }
})

/**
 * Lisää uuden tuotteen verkkokauppaan */
app.post('/products', async (req, res) => {

    const connection = await mysql.createConnection(conf);

    try {
        
        connection.beginTransaction();
        const products = req.body;
        

        for (const product of products) {
            await connection.execute("INSERT INTO product (name, price, image, category_id) VALUES (?,?,?,?)",[product.productName, product.price, product.imageUrl, product.category]);
        }
    
        connection.commit();
        res.status(200).send("Products added!");

    } catch (err) {
        connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.end();
    }
});

/**
 * Lisää uusia kategorioita tietokantaan
 */
app.post('/categories', async (req, res) => {

    const connection = await mysql.createConnection(conf);

    try {
        
        connection.beginTransaction();
        const categories = req.body;
        
        for (const category of categories) {
            await connection.execute("INSERT INTO category (name) VALUES (?)",[category.categoryName]);
        }
    
        connection.commit();
        res.status(200).send("Categories added!");

    } catch (err) {
        connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.end();
    }
});

/**
 * Lisää tilauksen. 
 */
app.post('/order', async (req, res) => {

    let connection;

    try {
        connection = await mysql.createConnection(conf);
        connection.beginTransaction();

        const order = req.body;
        
        const [info] = await connection.execute("INSERT INTO customer_order (order_date, customer_id) VALUES (NOW(),?)",[order.customerId]);
        
        const orderId = info.insertId;

        for (const product of order.products) {
            await connection.execute("INSERT INTO order_line (order_id, product_id, quantity) VALUES (?,?,?)",[orderId, product.productId, product.quantity]);            
        }

        connection.commit();
        res.status(200).json({orderId: orderId});

    } catch (err) {
        connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.end();
    }
});

/**
 * Lisää uuden tuotteen tietokantaan
 */

app.post("/new",async function(req,res) {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('insert into item (description) values (?) ',[req.body.description])
        res.status(200).json({id:result.insertId})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

/**
 * Poistaa tuotteen tietokannasta
 */

app.delete("/delete/:id",async function(req,res) {
    try {
        const connection = await mysql.createConnection(config.db)
        await connection.execute('delete from item where id = ? ',[req.params.id])
        res.status(200).json({id:req.params.id})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})


app.listen(port)

