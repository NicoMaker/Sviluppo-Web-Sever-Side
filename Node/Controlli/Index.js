import 'dotenv/config'
import {checkEnvs, checkOS, checkNodeVersion} from './setup/index.js';
import express from 'express'
import chalk from 'chalk';

// const { checkEnvs, checkOS, checkNodeVersion} = require('./setup/index.js');

const REQUIRED_ENVS = [
    'DB_US',
    'DB_PWD'
];

const init = () => {
    checkEnvs(REQUIRED_ENVS);
    checkOS();
    checkNodeVersion();
}

init();

const app = express()

app.get('/ping', (req, res) => {
    res.send('pong')
})

app.listen(3000, () => {
    console.log(chalk.yellow('Server in ascolto su http://localhost:3000'))
})