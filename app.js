import express from 'express';
import cluster from 'cluster';
import core from 'os';

const app = express();

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid}`)
    //crear hijos (workers)
    for (let i=0; i<core.cpus().length; i++) {
        cluster.fork()
    }

    //reemplazar procesos hijos
    cluster.on('exit', () => cluster.fork())

} else {
    app.listen(8080, () => console.log(`Server Up by process ${process.pid}`))

    app.get('/', (req, res) => {
        let today = new Date()
        let date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}}`
        res.send(`Express web server on port 8080 - PID ${process.pid} - ${date}`)
    })

    app.get('/calculo', (req, res) => {
        let result = 0
        for (let i=0; i<5e9; i++) result+=i
        res.send({result, worker_id: process.pid})
    })
}