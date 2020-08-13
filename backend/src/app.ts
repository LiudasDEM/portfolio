import express from 'express'
import compression from 'compression'


const app = express()


app.use(compression())
app.use(express.json())


export default app
