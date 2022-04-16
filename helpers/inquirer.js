const inquirer = require('inquirer');
const colors = require('colors');

const menuOptions = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que quieres hacer? '.white,
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Cargar historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]


const inquirerMenu = async() => {

    console.clear()

    console.log('===================================='.green);
    console.log('       Seleccione una opción'.white);
    console.log('====================================\n'.green);

    const options = await inquirer.prompt(menuOptions)

    return options.opcion
    
}

const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${ 'ENTER'.white } para continuar`
        }
    ]

    console.log('\n')           
    await inquirer.prompt(question)
}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate( value ){
                if( value.length < 2){
                    return 'Por favor ingrese una descripción'
                }
                return true;
            }
            
        }
    ];

    const { descripcion } = await inquirer.prompt(question);
    return descripcion;

}

const listadoDeLugares = async( lugares = [] ) =>{
    
    const choices = lugares.map( (lugar, i) => {

        const idx = `${i+1}.`.green
        
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }

    });

    choices.unshift({                               // agregar una opción para salir del menu al inicio del array
        value: '0',
        name: `${'0.'.green} Cancelar`
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar',
            choices
        }
    ]

    const resp = await inquirer.prompt(preguntas);
    
    const id = resp.id;
    
    return id;  
}



module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoDeLugares,

}


