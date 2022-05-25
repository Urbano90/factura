

const formDetalle = document.getElementById("formDetalle");
const cantidad = document.getElementById("inputCantidad");
const descripcion = document.getElementById("selectDescripcion");
const pUnitario = document.getElementById("inputPUnitario");
const pTotal = document.getElementById("inputPTotal");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnGuardar = document.getElementById("btnGuardar");
const nombre = document.getElementById("nombre");
const ruc = document.getElementById("ruc");
const nro = document.getElementById("nro");
const direccion = document.getElementById("direccion");
const fecha = document.getElementById("fecha");
const formCabecera = document.getElementById("formCabecera");


let arregloDetalle = [];
let facturas = [];

let arregloProductos = [
    { id:1,nombre: "Monitor", precio: 120000 },
    { id:2, nombre: "Impresora", precio: 50000 },
    { id:3, nombre: "Targeta gràfica", precio: 60000 },
    { id:4, nombre: "Libro", precio: 3650 },
    { id:5, nombre: "Fotocopiadora", precio: 423000 },
    { id:6, nombre: "Telèfono", precio: 85200 },
    { id:7, nombre: "Disco duro", precio: 34852 },
    { id:8, nombre: "Mochila", precio: 85420 },
    { id:9, nombre: "Libreta", precio: 120000 },
    { id:10, nombre: "USB", precio: 26405 },
    { id:11, nombre: "Escritorio", precio: 246012 },
    { id:12, nombre: "Proyector", precio: 345750 }
];

// Para mantener todas las facturas dentro del localStorage
//aun habiendo restaurado la pagina
const verificarFacturasLocalStorage = () => {
    const facturasLS = JSON.parse(localStorage.getItem("facturas"));
       facturas = facturasLS || [];
}
verificarFacturasLocalStorage();

// Crear elemento del arreglo arriba cread de arreglo de productos
const llenarProductos = () => {
    arregloProductos.forEach((p) => {
       const option = document.createElement("option");
       option.value = p.id;
       option.innerText = p.nombre;
       selectDescripcion.appendChild(option);
    })
}
//llamamos a la function llenarProductos
llenarProductos();
const getNombreProductoById = (id) => {
    const objProducto = arregloProductos.find((p) => {
        if (p.id === +id) {
            return p;
        }
    });
    return objProducto.nombre;
};

const getPrecioProductoById = (id) => {
    const objProducto = arregloProductos.find((p) => {
        if (p.id === +id) {
            return p;
        }
    });
    return objProducto.precio;
};

const redibujarTabla = () => {  //creamos la salida del resultado
    cuerpoTabla.innerHTML = ""; //asegurar que cada vez que se saque nuevos dados, esté vacio
    arregloDetalle.forEach((detalle) => {
        let fila = document.createElement("tr")
        fila.innerHTML = `<tr>
                         <td class="cantidad">${detalle.cantidad}</td>
                         <td class="descripcion">${getNombreProductoById(detalle.descripcion)} </td>
                         <td class="p-unitario">${detalle.pUnitario} </td>
                         <td class="p-total">${detalle.pTotal} </td> </tr> `
                         let tdEliminar = document.createElement("td");
                         let botonEliminar = document.createElement("button"); // creamos un boton
                botonEliminar.classList.add("btn");  // Creamos clases al boton creado
                botonEliminar.innerText = "Eliminar"; // Insertamos texto al boton creado
                tdEliminar.appendChild(botonEliminar);
                botonEliminar.onclick = () => {
                   console.log(detalle);
                   eliminarDetalleById(detalle.descripcion);
                }
                fila.appendChild(tdEliminar);
                cuerpoTabla.appendChild(fila);
    });
};

const eliminarDetalleById = (id) => {
    arregloDetalle = arregloDetalle.filter((detalle) => {
        if(+id !== +detalle.descripcion) {
            return detalle;
        }
    })
    redibujarTabla();
    }

const agregarDetalle = (objDetalle) => {  // Creamos una function llamada agregarDetalle
    // Buscar si el objeto detalle ya existe en el arreglo detalle,
    // y si s asi sumar las cantidades para que solo aparezca una vez
    const resultado = arregloDetalle.find((detalle) => {
        if(+objDetalle.descripcion === +detalle.descripcion) {
            return detalle;
        }
    });
    if(resultado) {
        arregloDetalle = arregloDetalle.map((detalle) => { // Cuando el resultado existe
            if(detalle.descripcion === objDetalle.descripcion) {
             return {
                 cantidad: +detalle.cantidad + +objDetalle.cantidad,
                 descripcion: detalle.descripcion,
                 pTotal: (+detalle.cantidad + +objDetalle.cantidad) * +detalle.pUnitario,
                 pUnitario: +detalle.pUnitario,
             };
            }
            return detalle;
        });
    } else {
        arregloDetalle.push(objDetalle);
    }
};

formDetalle.onsubmit = (e) => { /*para que se agregue el formulario detalle*/
    e.preventDefault();

    //Creando objeto detalle
    const objDetalle = {
        cantidad: inputCantidad.value,
        descripcion: selectDescripcion.value,
        pUnitario: inputPUnitario.value,
        pTotal: inputPTotal.value,
    };
agregarDetalle(objDetalle);

    //console.log(objDetalle)
    //console.log(arregloDetalle)
    redibujarTabla();
    formDetalle.reset();
};

// Le damos funcionalidad al boton guardar para imprimir los datos de los dos input
btnGuardar.onclick = () => {
    // crear el objeto de la cabecera
    let objFactura = {
        nombre: nombre.value,
        ruc: ruc.value,
        numero: nro.value,
        direccion: direccion.value,
        fecha: fecha.value,
        detalle: arregloDetalle,  // los datos del segundo input
    };
    //console.log(objFactura);
    facturas.push(objFactura);
    //Limpiar los campos
    formCabecera.reset();
    formDetalle.reset();
    //LocalStorage
    localStorage.setItem("facturas", JSON.stringify(facturas));   //Guardamos los datos en el local storage
    //Borrar la tabla del tbody
    arregloDetalle = [];
    redibujarTabla();
};

selectDescripcion.onchange = () => {
    if (selectDescripcion.value == "0") { // si el detalle del formulario está vacio, reseteamos los datos
        formDetalle.reset();
        return;
    }
    const precio = getPrecioProductoById(selectDescripcion.value);
    if (precio) {  // si hay precio, el iUnitario nos saca el valor de precio
        inputPUnitario.value = precio;
        calcularTotal();
    }
   // console.log(selectDescripcion.value)
};

// Realizamos la operación para calcular el precio total
const calcularTotal = () => {
    const cantidad = +inputCantidad.value;
    const pUnit = +inputPUnitario.value;
    const total = cantidad * pUnit;
    inputPTotal.value = total.toFixed(2);//ponemos el tofixed(2) para que el total solo tenga 2 decimales en el resultado
};

inputCantidad.onkeyup = () => { // cada vez que presione la tecla en el inputCantidad
       calcularTotal();
};
inputCantidad.onchange = () => { // cada vez que cambio en el input cantidad debe calcular el total
    calcularTotal();
};
