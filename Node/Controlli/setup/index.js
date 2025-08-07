import chalk from 'chalk';

export const checkEnvs = (REQUIRED_ENVS) => {
    console.log(chalk.blue('Verifica ENV'))

    return REQUIRED_ENVS.find(key => {
        const isSet = process.env[key];

        if(!isSet) {
            console.error(chalk.red(` - È richiesta la ENV: ${key}`))
            process.exit(1);
        } else {
            console.log(chalk.green(` - ${key}: ${process.env[key]}`))
        }
        return !isSet
    }) === undefined
}

export const checkOS = () => {
    console.log(chalk.blue('Verifica OS'))
    const osType = process.platform;
    const check = osType === 'linux'

    if (!check) {
        console.error(chalk.red(` - Richiesto OS linux, trovato: ${osType}`))
        process.exit(1);
    } else {
        console.log(chalk.green(' - Sistema opertivo linux'))
    }

    return process.env.platform === 'linux'
}

export const checkNodeVersion = () => {
    console.log(chalk.blue('Verifica NODE'))

    const nodeVersion = parseInt(process.versions.node.split('.')[0]);
    const check = nodeVersion >= 16;

    if (!check) {
        console.error(` - Versione di Node richiesta: 16, trovata ${nodeVersion}`)
        process.exit(1);
    } else {
        console.log(chalk.green(' - Node version >= 16'))
    }

    return check;
}
