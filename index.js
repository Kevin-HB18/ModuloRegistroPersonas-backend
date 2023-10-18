const port = process.env.PORT || 3001,
express = require('express'),
app = express();
db = require('./models');
const cors = require("cors");

app.listen(port, ()=>{
    console.log(`Servidor corriendo en puerto ${port}...`)
});

app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const corsOptions = {
    origin: ['localhost:3000']
};

app.use(cors(corsOptions));

//app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM PERSONA;'; // Reemplaza 'nombre_de_la_tabla' con el nombre de la tabla en tu base de datos.
        const result = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });        
        res.json(result);
    } catch (error) {
        console.error(`Error en la consulta SELECT: ${error}`);
        res.status(500).json({ error: 'Error en la consulta SELECT' });
    }
});


app.get('/api/obtenerDatos', async (req, res) => {
    try {
        const query = 'SELECT TIPODOC.DESCTIPODOC,NDOCUMENTO,NOMBRE,APELLIDO,DIRECCION,CORREO,CELULAR FROM PERSONA,TIPODOC WHERE TIPODOC.IDTIPODOC=PERSONA.IDTIPODOC;'; // Reemplaza 'nombre_de_la_tabla' con el nombre de la tabla en tu base de datos.
        const result = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });        
        res.json(result);
    } catch (error) {
        console.error(`Error en la consulta SELECT: ${error}`);
        res.status(500).json({ error: 'Error en la consulta SELECT' });
    }
});

app.get('/api/obtenerTipo', async (req, res) => {
    try {
        const query = 'SELECT * FROM TIPODOC;'; // Reemplaza 'nombre_de_la_tabla' con el nombre de la tabla en tu base de datos.
        const result = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });        
        res.json(result);
    } catch (error) {
        console.error(`Error en la consulta SELECT: ${error}`);
        res.status(500).json({ error: 'Error en la consulta SELECT' });
    }
});

app.post('/api/insertarPersona', async (req, res) => {
    try{   
        const {IDTIPODOC, NDOCUMENTO, NOMBRE, APELLIDO, DIRECCION, CORREO, CELULAR} = req.body;               
        const query = `INSERT INTO persona (IDTIPODOC, NDOCUMENTO, NOMBRE, APELLIDO, DIRECCION, CORREO, CELULAR) VALUES (:IDTIPODOC, :NDOCUMENTO, :NOMBRE, :APELLIDO, :DIRECCION, :CORREO, :CELULAR)`;
        await db.sequelize.query(query, {
            replacements: {
              IDTIPODOC,
              NDOCUMENTO,
              NOMBRE,
              APELLIDO,
              DIRECCION,
              CORREO,
              CELULAR,
            },
            type: db.sequelize.QueryTypes.INSERT,
          });        
    }catch(error){
        console.error('Error al insertar datos en la base de datos: ' + error);
        res.status(500).json({ error: 'No se pudo registrar la persona.' });
    }  
  });

  app.post('/api/verificarRegistro', async (req, res) => {
    try {
      const { IDTIPODOC, NDOCUMENTO } = req.body;     
      const query = `SELECT COUNT(*) AS COUNT FROM persona WHERE IDTIPODOC = :IDTIPODOC AND NDOCUMENTO = :NDOCUMENTO ;`;
      const result = await db.sequelize.query(query, {
        replacements: {
          IDTIPODOC,
          NDOCUMENTO,
        },
        type: db.sequelize.QueryTypes.SELECT,
      });
  
      // Si count es mayor que 0, significa que ya existe una combinación en la base de datos      
      const exists = result[0].COUNT > 0;  
      res.json({ exists });
    } catch (error) {
      console.error('Error al verificar el registro:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
  

/*db.sequelize
.sync({force:true})
.then(()=>console.log('conectado a base de datos'))
.catch((e)=>console.log(`Error => ${e}`));*/

