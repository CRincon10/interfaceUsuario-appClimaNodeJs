require('dotenv').config()


const { 
    leerInput, 
    inquirerMenu,
    pausa,
    listadoDeLugares,

} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas = new Busquedas()        //instancia de la clase busqueda fuera del ciclo par que mantenga el historial de busquedas

    let opcion;

    do {

        opcion = await inquirerMenu();

        switch (opcion) {
            case 1:
                //mostrar mensaje para recibir ciudad
                const terminoDeBusqueda = await leerInput('Ciudad: ');
                //buscar ciudad muestro todas las ciudades para que el usuario seleccione
                const lugares = await busquedas.buscarCiudad(terminoDeBusqueda);
                //Seleccionar el lugar usuario selecciona la ciudad
                const idLugar = await listadoDeLugares(lugares);   //listadoDeLugares solo devuelve el id del lugar
                //validaciones
                if ( idLugar === '0' ){
                    console.log('\n')
                    console.log('No se encontro la ciudad'.red)
                    console.log('\n')
                    await pausa()
                    continue
                }
                const lugarSeleccionado = lugares.find( l => l.id === idLugar)

                //sino es 0 entonces se va a guardar en la base de datos
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                


                const clima = await busquedas.buscarClima(lugarSeleccionado.lat, lugarSeleccionado.lng);

                

                //Buscar clima con geolocation

                //mostrar el clima de la ciudad seleccionada
                console.clear()
                console.log(`\n===*Información de la ciudad*===\n`.white);
                console.log('Ciudad:'.green, lugarSeleccionado.nombre);
                console.log('Lat:'.green, lugarSeleccionado.lat);
                console.log('Lng:'.green, lugarSeleccionado.lng);
                console.log('Temperatura:'.green, clima.temperatura );  
                console.log('Máxima:'.green, clima.maxima );
                console.log('Mínima:'.green, clima.minima );
                console.log('Descripción:'.green, clima.desc );
                
                console.log(`\nEl clima de ${lugarSeleccionado.nombre} es de ${clima.temperatura}°C\n`.green);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) =>{
                    const idx = `${i+1}.`.green
                    console.log(`${idx}. ${lugar} `)
                });
            break;

        }

        await pausa();


    }while (opcion !== 0)
}


main();







