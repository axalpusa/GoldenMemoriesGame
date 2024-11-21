class Partida {
    constructor(nombre, nivel, puntos, tiempo, fecha) {
        this._nombre = nombre;
        this._nivel = nivel;
        this._puntos = puntos;
        this._tiempo = tiempo;
        this._fecha = fecha;
    }

    set nombre(value) {
        return this._nombre = value;
    }

    get nombre() {
        return this._nombre;
    }

    set nivel(value) {
        return this._nivel = value;
    }

    get nivel() {
        return this._nivel;
    }

    set puntos(value) {
        return this._puntos = value;
    }

    get puntos() {
        return this._puntos;
    }

    set tiempo(value) {
        return this._tiempo = value;
    }

    get tiempo() {
        return this._tiempo;
    }

    set fecha(value) {
        return this._fecha = value;
    }

    get fecha() {
        return this._fecha;
    }
}
let contenidoScrore;
async function guardarPuntuacion() {
    document.getElementById("modalScore").setAttribute("class", "modalDialog");
    let nuevaPartida = document.getElementById("nombreJugador");
    nuevaPartida.value = "";
    nuevaPartida.focus();

    let lvbNivel = document.getElementById("nivelPartida");
    lvbNivel.innerHTML = document.getElementById("lvlPartidasValue").innerHTML;

    let lblPuntos = document.getElementById("puntosPartida");
    lblPuntos.innerHTML = document.getElementById("puntosValue").innerHTML;

    let lblTiempo = document.getElementById("tiempoPartida");
    lblTiempo.innerHTML = document.getElementById("Minutos").innerHTML + "" + document.getElementById("Segundos").innerHTML;

    document.getElementById("guardarJugador").onclick = async function () {
        let nombreJugador = document.getElementById("nombreJugador").value;
        let fechaActual = new Date();
        fechaActual = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();

        if(nombreJugador == "") {
            nombreJugador = "Sin nombre";
        }
        await webStorage(new Partida(nombreJugador,lvbNivel.innerHTML, lblPuntos.innerHTML, lblTiempo.innerHTML, fechaActual));
        document.getElementById("modalScore").setAttribute("class", "hide");
         historialPartidas();
    };

    document.getElementById("cancelar").onclick = async function () {
        document.getElementById("modalScore").setAttribute("class", "hide");
         historialPartidas();
    };
}

async function historialPartidas() {
   
    await getGist();
    document.getElementById("modalTableScore").setAttribute("class", "modalDialog");
    let historial = JSON.parse(contenidoScrore);
    if (historial != null) {
        historial = ordenar(historial);
        historial.forEach(partida => {
            getPartida(Object.values(partida).toString());
        });
    }

  /*  document.getElementById("limpiar").onclick = async function () {
       // localStorage.clear();
        await updateGist('[{"_nombre":"NOMBRE","_nivel":"NIVEL","_puntos":"PUNTOS","_tiempo":"TIEMPO","_fecha":"FECHA"}]');
        location.reload();
    };*/

    document.getElementById("cerrar").onclick = function () {
        location.reload();
    };
}

//LOCALSTORAGE HISTORIAL PARTIDAS GUARDADAS
async function webStorage(valor) {
    await getGist();
    let webStorage = JSON.parse(contenidoScrore);
    if (webStorage == null) {
        webStorage = [];
    }
   await webStorage.push(valor);
    await updateGist(JSON.stringify(webStorage));
   /* let clave = "partidas";
    let webStorage = JSON.parse(localStorage.getItem(clave));
    if (webStorage == null) {
        webStorage = [];
    }
    webStorage.push(valor);
    localStorage.setItem("partidas", JSON.stringify(webStorage));*/
}

function getPartida(partida) {
    let contenedor = document.createElement('DIV');
    contenedor.setAttribute("class", "tPartidas");
    let comaPos = partida.indexOf(",");
    while (comaPos != -1) {
        contenedor.innerHTML += "<label>" + partida.substr(0, comaPos) + "</label>"
        partida = partida.substr(comaPos + 1);
        comaPos = partida.indexOf(",");
    }

    contenedor.innerHTML += "<label>" + partida + "</label>";
    document.getElementById("tPartidas").appendChild(contenedor);
}

function intercambiar(array, element1, element2) {
    var tmp = array[element1];
    array[element1] = array[element2];
    array[element2] = tmp;
    return array;
}

function ordenar(historial) {
    var size = historial.length;
    for (let partida = 1; partida < size; partida++) {
        for (let i = 0; i < (size - partida); i++) {
            var sig = i + 1;
            if (historial[i]._puntos < historial[sig]._puntos) {
                intercambiar(historial, i, sig);
            }

            if (historial[i]._puntos == historial[sig]._puntos) {
                if (historial[i]._tiempo > historial[sig]._tiempo) {
                    intercambiar(historial, i, sig);
                }

                if (historial[i]._tiempo == historial[sig]._tiempo) {
                    let fecha = new Date(historial[i]._fecha);
                    let fechaSig = new Date(historial[sig]._fecha);
                    if (fecha.getTime() < fechaSig.getTime()) {
                        intercambiar(historial, i, sig);
                    }
                }
            }
        }
    }
    return historial;
}
const gistId = '92bb1f7fba6019d5c44e33b1f43a01c7';
const token = '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';

async function getGist() {
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        const data = await response.json(); 
        contenidoScrore = data.files['cine.txt'].content; 
    } catch (error) {
        console.error('Error al obtener el Gist:', error);
    }
}

async function updateGist(content) {
    const gistData = {
        files: {
            'cine.txt': { 
                content: content  
            }
        }
    };
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error al actualizar el Gist:', error);
    }
}


