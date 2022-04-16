const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbpath = './db/baseDatos.json';

    constructor() {
        this.leerBaseDatos()
    }


    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');    //separa las palabras por espacios
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1)) //convierte la primera letra de cada palabra en mayuscula y le agrega el resto de la palabra a la cadena de texto

            return palabras.join(' '); //une las palabras en una sola cadena de texto

        })
    }


    get parametrosBusqueda (){
        return {                                                                       //parametros de la peticion, todo lo que esta despues del ? en la url se conoce como parametros
            "access_token": process.env.MAPBOX_KEY || '',
            "limit": "5&proximity=ip",
            "language": "es",
        }
    }

    async buscarCiudad( lugar = '' ) {

        try {
            //instancia de axios para hacer peticiones http
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.parametrosBusqueda
            });
    
            //hacer la peticion
            const respuesta = await instance.get();
            // console.log(respuesta.data);
            //return    en features esta la informacion de la ciudad
            return respuesta.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name_es,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }) )      



        } catch (error) {
            return []
        }

    }

    get parametrosClima() {
        return {
        "appid": process.env.OPENWEATHER_KEY || '',
        "units": "metric",
        "lang": "es",
    }}


    async buscarClima( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.parametrosClima, lat, lon}
            });
    
            const {data} = await instance.get();
            const {main, weather} = data;
            const {temp, temp_max, temp_min} = main;
            const {description} = weather[0];
            

            return {
                temperatura: temp,
                maxima: temp_max,
                minima: temp_min,
                desc: description
                
            }


        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar='') {

        if(this.historial.includes(lugar.toLocaleLowerCase())){    //toLocaleLowerCase() convierte todo a minusculas
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());  //unshift agrega al inicio del arreglo
        this.historial = this.historial.slice(0,5);   //con el slice se limita el numero de elementos del array de la posicion 0 hasta la posicion 5

        //guardar en base de datos
        this.guardarHistorial();

    }

    guardarHistorial() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbpath, JSON.stringify(payload) )
    }

    leerBaseDatos() {

        if(!fs.existsSync(this.dbpath)){
            return
        }

        const info = fs.readFileSync(this.dbpath, 'utf-8');
        const data = JSON.parse(info);

        this.historial = data.historial;

    }



}

module.exports = Busquedas;
