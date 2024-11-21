let parejasAcertadas = [];
let numImgVisibles = 0;

let puntos = 0;
let nivel = 0;
//let nivelMinutos = 0;
//let nivelSegundos = 0;
let maxPuntos = 0;
let partidaIniciada = false;
let click = null;
window.onload = grid;

function grid() {
	// Obtener un Gist con su ID
	cargarImagenes();
	obtenerNivelActual();
	click = document.getElementById("click");
	//getMaxPuntos();
	//NIVEL DIFICULTAD
	let modal = document.getElementById("dificultadBtn");
	let buttons = modal.childNodes;
	buttons.forEach(button => {
		button.onclick = dificultad;
	});
	document.getElementById("tablaPuntuaciones").onclick = historialPartidas;
	document.getElementById("ayuda").onclick = startIntro;
}

function dificultad() {
	if(this.id === "iniciar"){
		switch (nivel) {
			case 1:
			case 2:
			case 3:
				generarCartas(3, 3, nivelUno);
				break;
			case 4:
			case 5:
			case 6:
				generarCartas(4, 6, nivelDos);
				break;
			case 7:
			case 8:
			case 9:
				generarCartas(5, 10, nivelTres);
				break;
		}
	}else if(this.id === "reiniciar"){
		nivel = 1;
		puntos = 0;
		minutos = 0;
		segundos = ":0";
		guardarNivel(nivel,puntos,minutos,segundos);
		location.reload();
	}
	
	
	document.getElementById("modal").setAttribute("class", "hide");
}

function generarCartas(valorDificultad, numImg, tematica) {
	setLvlPartida(valorDificultad);
	cronometrar();
	cargarNumPartidas();

	let parentElement = document.getElementById("wrapper");
	let numElements = valorDificultad * (valorDificultad - 1);
	let listaImagenes = imagenes(numImg, tematica);

	for (let i = 0; i < numElements; i++) {
		let img = document.createElement('INPUT');
		img.setAttribute("type", "image");
		img.setAttribute("class", "imagenCarta");
		img.setAttribute("visible", false);
		img.setAttribute("src", listaImagenes[i]);
		carta(parentElement, img, numImg);
	}
	parentElement.style.setProperty('--rowNum', valorDificultad);
	parentElement.style.setProperty('--colNum', valorDificultad);
}

function carta(contenedor, img, numImg) {
	let carta = document.createElement('DIV');
	carta.setAttribute("class", "carta");
	contenedor.appendChild(carta);

	let front = document.createElement('DIV');
	front.setAttribute("class", "front face");
	carta.appendChild(front);
	front.appendChild(img);

	let back = document.createElement('DIV');
	back.setAttribute("class", "back face");
	carta.appendChild(back);

	let imgReverso = document.createElement('INPUT');
	imgReverso.setAttribute("type", "image");
	imgReverso.setAttribute("src", "img/reverso.png");
	back.appendChild(imgReverso);

	carta.onclick = function () {
		click.play();
		if (img.getAttribute("visible") == "false") {
			carta.classList.add("mostrar");
			img.setAttribute("visible", true);
			numImgVisibles++;

			comprobarParejas();
			scorePartida();

			if (parejasAcertadas.length == numImg) {
				//guardarPuntuacion();
				cronometrar();
				let minutos = document.getElementById("Minutos").innerHTML;
				let segundos = document.getElementById("Segundos").innerHTML;
				nivel = nivel +1;
				guardarNivel(nivel,puntos,minutos,segundos);
				if(nivel < 10){
					location.reload();
				}else{
					nivel = 1;
					puntos = 0;
					minutos = 0;
					segundos = ":0";
					guardarNivel(nivel,puntos,minutos,segundos);
					guardarPuntuacion();
				}
				//dificultad();
				//guardarPuntuacion(); //Función del fichero modalScore.js //axalpusa al finalizar los niveles
			}
		}
	}
}

function imagenes(numImg, tematica) {
	let imagenes = [];
	let i = 0;
	while (i < numImg) {
		let nuevaImagen = tematica[getAleatorio(tematica)];
		if (!imagenes.includes(nuevaImagen)) {
			imagenes[i] = nuevaImagen;
			i++;
		}
	}
	return mezclarImagenes(imagenes, numImg);
}

function mezclarImagenes(imagenes, numImg) {
	let baraja = [];
	baraja.length = numImg * 2;

	let i = 0
	while (i < baraja.length) {
		let nuevaImagen = imagenes[getAleatorio(imagenes)];
		if (!baraja.includes(nuevaImagen) || contarRepeticiones(baraja, nuevaImagen) < 2) {
			baraja[i] = nuevaImagen;
			i++;
		}
	}
	return baraja;
}

function contarRepeticiones(lista, imagen) {
	let repeticiones = 0;
	for (let i = 0; i < lista.length; i++) {
		if (lista[i] == imagen) {
			repeticiones++;
		}
	}
	return repeticiones;
}

function comprobarParejas() {
	if (numImgVisibles == 2) {
		bloquearPanel(true);
		cronometrar();

		let parejas = [];
		numImgVisibles = 0;

		let imagenes = document.getElementsByClassName("imagenCarta");
		for (let i = 0; i < imagenes.length; i++) {
			if (!parejasAcertadas.includes(imagenes[i].getAttribute("src")) & imagenes[i].getAttribute("visible") == "true") {
				parejas.push(imagenes[i]);
			}
		}

		if (parejas[0].getAttribute("src") != parejas[1].getAttribute("src")) {
			if (puntos != 0) {
				puntos--;
				getMaxPuntos();
			}

			setTimeout(
				function () {
					girarParejas(parejas[0], parejas[1]);
					setTimeout(function () {
						bloquearPanel(false);
						cronometrar();
					}, 1000);
				},
				1000
			);
		}
		else {
			parejasAcertadas.push(parejas[0].getAttribute("src"));
			puntos += 10;
			bloquearPanel(false);
			getMaxPuntos();
			cronometrar();
		}
	}
}

function girarParejas(pareja1, pareja2) {
	pareja1.closest(".carta").classList.remove("mostrar");
	pareja1.classList.add("ocultar");
	pareja1.setAttribute("visible", false);

	pareja2.closest(".carta").classList.remove("mostrar");
	pareja2.classList.add("ocultar");
	pareja2.setAttribute("visible", false);
}

function getAleatorio(tematica) {
	return Math.floor(Math.random() * (tematica.length - 0));
}

function bloquearPanel(bloquear) {
	let tablero = document.getElementById("wrapper");
	if (bloquear)
		tablero.classList.add("bloquear");
	else
		tablero.classList.remove("bloquear");

	let imagenes = document.getElementsByClassName("imagenCarta");
	for (let i = 0; i < imagenes.length; i++) {
		imagenes[i].disabled = bloquear;
	}
}

function scorePartida() {
	let divScore = document.getElementById("puntosValue");
	divScore.innerHTML = puntos;
}
function setLvlPartida(valorDificultad) {
	let lvlPartida = document.getElementById("lvlPartidasValue");
	switch (valorDificultad) {
		case 3:
			lvlPartida.innerHTML = "facil";
			break;
		case 4:
			lvlPartida.innerHTML = "medio";
			break;
		case 5:
			lvlPartida.innerHTML = "dificl";
			break;
	}
}

//CRONOMETRO(EL EL FICHERO CRONOMETRO.JS)

function cronometrar() {
	if (partidaIniciada) {
		partidaIniciada = false;
		parar();
	}
	else {
		partidaIniciada = true;
		inicio();
	}
}

function getMaxPuntos() {
	let historial = JSON.parse(localStorage.getItem("partidas"));
	if (historial != null) {
		maxPuntos = historial[0]._puntos;
	}
	else {
		maxPuntos = puntos;
	}
	setMaxPuntos();
}

function setMaxPuntos() {
	let maxScore = document.getElementById("puntosMaxValue");
	maxScore.innerHTML = maxPuntos;
}
function setPuntos() {
	let score = document.getElementById("puntosValue");
	score.innerHTML = puntos;
}
function cargarNumPartidas() {
	let clave = "numPartidas";
	let numPartidas = localStorage.getItem(clave);
	if (numPartidas == null) {
		numPartidas = 1;
	}
	else {
		numPartidas++;
	}
	localStorage.setItem(clave, numPartidas);
	document.getElementById("numPartidasValue").innerHTML = numPartidas;
}

function startIntro() {
	var intro = introJs();
	intro.setOptions({
		steps: [
			{
				element: '#dificultadBtn',
				intro: "Boton 'Iniciar' empieza nuevo nivel, 'Resetear' regreso todo desde el inicio."
			},
			{
				element: '#tablaPuntuaciones',
				intro: "Visualiza la tabla de puntuaciones guardadas, en orden descendente."
			},
			{
				element: '#lvlPartidas',
				intro: "Nivel de la partida."
			},
			{
				element: '#numPartidas',
				intro: "Número de partidas jugadas, guardadas y no guardadas."
			},
			{
				element: '#maxScore',
				intro: "Puntuación máxima registrada."
			},
			{
				element: '#score',
				intro: 'Puntos obtenidos durante la partida.'
			},
			{
				element: '#cronometro',
				intro: "Tiempo de juego."
			}
		],
		nextLabel: 'Siguiente',
		prevLabel: 'Anterior',
		skipLabel: 'Omitir',
		doneLabel: 'Hecho',
		exitOnOverlayClick: false
	});
	intro.start();
}
class NivelPartida {
    constructor(nivel, puntos, minutos,segundos) {
        this._nivel = nivel;
        this._puntos = puntos;
        this._minutos = minutos;
		this._segundos = segundos;
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

    set minutos(value) {
        return this._minutos = value;
    }

    get minutos() {
        return this._minutos;
    }
	set segundos(value) {
        return this._segundos= value;
    }

    get segundos() {
        return this._segundos;
    }
}
function guardarNivel(nivel,puntos,minutos,segundos) {
	webNivel(new NivelPartida(nivel, puntos, minutos,segundos));
}
function webNivel(valor) {
    let clave = "nivelPartida";
	localStorage.removeItem(clave);
    let webStorage = JSON.parse(localStorage.getItem(clave));
    if (webStorage == null) {
        webStorage = [];
    }
    webStorage.push(valor);
    localStorage.setItem(clave, JSON.stringify(webStorage));
}
function getNivelPartida() {
    let nivelPartida = JSON.parse(localStorage.getItem("nivelPartida"));
    if (nivelPartida != null) {
        nivel = nivelPartida[0]._nivel;
        puntos = nivelPartida[0]._puntos;
        minutos = nivelPartida[0]._minutos;
		Minutos.innerHTML = minutos;
        segundos = nivelPartida[0]._segundos.substring(1);
		Segundos.innerHTML = ":" + segundos;
		this.segundos = segundos;
		this.minutos = minutos;
		setPuntos();
    } else {
        nivel = 1;
        puntos = 0;
        minutos = 0;
        segundos = ":0";
		guardarNivel(nivel,puntos,minutos,segundos);
    }
}

function obtenerNivelActual() {
	getNivelPartida();
}