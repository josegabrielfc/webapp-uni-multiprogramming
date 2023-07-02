/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const btnAgregar = document.getElementById("btnAgregar");
const btnLeer = document.getElementById("btnLeer");
const btnUni = document.getElementById("btnUni");
const btnMulti = document.getElementById("btnMulti");
const contenedorCampos = document.getElementById("contenedorCampos");
const contenedorUni = document.getElementById("contenedorUni");
const contenedorMulti = document.getElementById("contenedorMulti");
//Matriz que contendrá los datos leídos en los input-text
let matrizDatos = [];
let id = 1;
btnLeer.disabled = true;
btnUni.disabled = true;
btnMulti.disabled = true;

btnAgregar.addEventListener("click", function () {
  const divCampos = document.createElement("div");
  btnLeer.disabled = false;
  for (let i = 1; i <= 3; i++) {
    const inputCampo = document.createElement("input");
    inputCampo.type = "text";
    inputCampo.name = `campo${i}`;
    var m = "";
    switch (i) {
      case 1:
        m = "Input Process ID";
        inputCampo.value = id;
        inputCampo.readOnly = true;
        id++;
        break;
      case 2: m = "Input CPU Time";
        break;
      case 3: m = "Input I/O Time";
        break;
    }
    inputCampo.placeholder = m;
    divCampos.appendChild(inputCampo);
  }
  contenedorCampos.appendChild(divCampos);
});


btnLeer.addEventListener("click", function () {

  const camposTexto = document.querySelectorAll("input[type=text]");
  btnUni.disabled = false;
  btnMulti.disabled = false;
  let errors = [];
  // Validate data
  for (let i = 1; i < camposTexto.length; i += 3) {
    if (camposTexto[i].value === "") {
      errors.push("CPU Time field is required");
    } else if (isNaN(camposTexto[i].value) || parseInt(camposTexto[i].value) < 2) {
      errors.push("CPU Time must be a number greater than or equal to 2");
    }
    if (camposTexto[i + 1].value === "") {
      errors.push("I/O Time field is required");
    } else if (isNaN(camposTexto[i + 1].value) || parseInt(camposTexto[i + 1].value) < 0) {
      errors.push("I/O Time must be a number greater than or equal to 0");
    }
  }

  // Muestra los errores en una sola alerta
  if (errors.length > 0) {
    window.alert(errors.join("\n"));
    btnAgregar.disabled = true;
    return;
  }

  const filaTabla = document.createElement("tr");
  const celdaIdProceso = document.createElement("td");
  const celdaTiempoCPU = document.createElement("td");
  const celdaTiempoIO = document.createElement("td");

  let filas = camposTexto.length / 3;
  let col = 0;
  let j = 0;
  for (let i = 0; i < filas; i++) {
    matrizDatos[i] = [];
    matrizDatos[i][j] = camposTexto[col].value;
    matrizDatos[i][j + 1] = camposTexto[col + 1].value;
    matrizDatos[i][j + 2] = camposTexto[col + 2].value;
    col += 3;
  }
  window.alert("The data read dynamically in the input-text is loaded into an array named matrizDatos of size nx3. \n You can use this array to solve your requirements. ");
  console.log(matrizDatos);
  createTable(matrizDatos);
  btnAgregar.disabled = false;
});



function createTable(matrix) {
  let table = '<table border="2" align="center"><thead><tr><th style="width: 70px; text-align: center;">ID </th><th style="width: 100px; text-align: center;">CPU Time</th><th style="width: 100px; text-align: center;">I/O Time</th></tr></thead><tbody>';
  //let table = '<table border="2" align="center"><thead><tr><th>ID </th><th>CPU Time</th><th>I/O Time</th></tr></thead><tbody>';
  for (let i = 0; i < matrix.length; i++) {
    table += '<tr><td>' + matrix[i][0] + '</td><td>' + matrix[i][1] + '</td><td>' + matrix[i][2] + '</td></tr>';
  }
  table += '</tbody></table>';
  document.getElementById('tabla').innerHTML = table;
}


btnUni.addEventListener("click", function () {

  let tabla = document.getElementById("tablaUni");
  tabla.innerHTML = "";

  let matriz = [[], [], [], [], [], []];  // [0] Filas  // [1] CPU Time  // [2] I/O Time  // [3] CPU Time + I/O Time  // [4] Celdas color gris inicial  // [5] id

  //Crear titulos tabla
  let rowTitle = tabla.insertRow();
  rowTitle.insertCell();
  let totalC = 0;
  let total = 0;
  let grayC = 0;
  //crear filas y titulos
  for (let i = 0; i < matrizDatos.length; i++) {
    grayC += total;
    matriz[4][i] = grayC;
    //Obtener datos importantes
    const id = matrizDatos[i][0];
    const cpuTime = matrizDatos[i][1];
    const ioTime = matrizDatos[i][2];
    total = Number(cpuTime) + Number(ioTime);
    totalC += total;
    //Almacenar las filas y datos importantes
    matriz[0][i] = document.createElement("tr");
    matriz[1][i] = cpuTime;
    matriz[2][i] = ioTime;
    matriz[3][i] = total;
    matriz[5][i] = id;
    //Crear los titulos de la tabla
    let cTitulo = rowTitle.insertCell();
    cTitulo.setAttribute("colspan", total);

    executionColor(cTitulo, "Process " + id + " | CPU & I/O");
  }

  colAndRow(matriz, tabla, totalC, 5);
  paintCell(matriz, totalC); //Pintar celdas - CPU time & I/O Time
  
  showFormulaUni(matriz, true);
  //let matrizGlobal = matriz;
});

function processesColor(celda) {
  celda.style.border = "1px solid white";
  celda.style.color = "white";
  celda.style.fontWeight = "bold";
  celda.style.backgroundColor = "#47BCCD";
}

function executionColor(celda, titulo) {
  celda.style.borderRadius = "7px";
  celda.style.textAlign = "center";
  celda.innerText = titulo;
  celda.style.border = "3px solid white";
  celda.style.color = "white";
  celda.style.fontWeight = "bold";
  celda.style.backgroundColor = "#FFB53B";
}

function colAndRow(matriz, tabla, cant, id) { //Enumera el encabezado y inserta los colores en las celdas

  if (cant !== 0) {
    const row1 = tabla.insertRow();
    const empty = row1.insertCell();
    processesColor(empty);

    for (let i = 1; i <= cant; i++) {
      const num = row1.insertCell();
      processesColor(num);
      num.textContent = i;
      num.style.textAlign = "center";
    }
  }

  if (matriz !== null) {
    for (let i = 0; i < matriz[0].length; i++) {
      let row2 = matriz[0][i];
      let celda = row2.insertCell();
      celda.innerText = "Process " + matriz[id][i];
      processesColor(celda);
      tabla.appendChild(row2);
    }
  }
}

function paintCell(matriz, total) {
  for (let i = 0; i < matriz[0].length; i++) {
    let fila = matriz[0][i];
    let cVerde = matriz[1][i] - 2;
    let cBeige = matriz[2][i];
    let cRestantes = Number(total) - (Number(matriz[4][i]) + Number(matriz[3][i]));

    paint(fila, matriz[4][i], "gris");
    paint(fila, 1, "verde");
    paint(fila, cBeige, "beige");
    paint(fila, cVerde, "verde");
    paint(fila, 1, "verde");
    paint(fila, cRestantes, "gris");
  }

}
function paint(fila, n, colorX) {
  const colors = {
    beige: { color: "white", background: "#e0d1ba" },
    verde: { color: "white", background: "#8bbf88" },
    gris: { color: "white", background: "#bfbfbf" }
  };

  for (let i = 0; i < n; i++) {
    let celda = fila.insertCell();
    celda.style.border = "1px solid white";
    celda.style.color = colors[colorX].color;
    celda.style.backgroundColor = colors[colorX].background;
  }
}

function showFormulaUni(matriz, aux) {
  let numerador = "", denominador = "";
  let sumCPU = 0, sumIO = 0;

  let i = 0; // Calcular CPU Time & IO Time
  while (i < matriz[1].length) {
    numerador += matriz[1][i];
    denominador += matriz[2][i];
    sumCPU += Number(matriz[1][i]);
    sumIO += Number(matriz[2][i]);
    if (i !== matriz[1].length - 1) {
      numerador += "+";
      denominador += "+";
    }
    i++;
  }

  let formula = `\CPU / Utilization = \\frac{${numerador}}{${numerador}+${denominador}} = \\frac{${sumCPU}}{${sumCPU}+${sumIO}} = ${sumCPU / (sumCPU + sumIO) * 100}\\%`;

  // Mostrar fórmula
  const contenedor = document.getElementById(aux ? "formulaUni" : "formulaMulti");
  contenedor.innerHTML = `$$${formula}$$`;
  MathJax.typesetPromise([contenedor]);
}

btnMulti.addEventListener("click", function () {
  let tabla = document.getElementById("tablaMulti");
  tabla.innerHTML = "";
  let titulo = matrizDatos.length === 1 ? "Procces " : "Processes ";

  let matriz = [[], [], [], [], [],]  // [0] Filas  // [1] CPU Time  // [2] I/O Time  // [3] CPU Time + I/O Time  // [4] id

  let ioTimeAll = 0;
  let nuevaMatriz = orderMatriz(matrizDatos);


  //Crear titulos tabla
  let filaTitulo = tabla.insertRow();
  filaTitulo.insertCell();

  //crear filas y titulos
  for (let i = 0; i < nuevaMatriz.length; i++) {
    //Obtener datos importantes
    const id = nuevaMatriz[i][0];
    const cpuTime = nuevaMatriz[i][1];
    const ioTime = nuevaMatriz[i][2];
    //Almacenar las filas y datos importantes
    matriz[0][i] = document.createElement("tr");
    matriz[1][i] = cpuTime;
    matriz[2][i] = ioTime;
    matriz[3][i] = Number(cpuTime) + Number(ioTime);
    matriz[4][i] = id;
    ioTimeAll += Number(ioTime);
    titulo += (!(i === nuevaMatriz.length - 1) || nuevaMatriz.length === 1) ? (id + ",") : (" and " + id);
  }
  titulo += nuevaMatriz.length === 1 ? " is interleaved" : " are interleaved";
  //Crear el titulo de la tabla
  let cTitulo = filaTitulo.insertCell();

  executionColor(cTitulo, titulo);
  colAndRow(matriz, tabla, 0, 4);

  orderForQuantity(matriz);

  //Colorear celdas de acuerdo a CPU time & I/O Time
  //Primera fila
  paint(matriz[0][0], 1, "verde");
  paint(matriz[0][0], matriz[2][0], "beige");
  paint(matriz[0][0], matriz[1][0] - 2, "verde");
  paint(matriz[0][0], 1, "verde");
  //Filas restantes
  for (let i = 1; i < matriz[0].length; i++) {
    let fila = matriz[0][i];
    let cVerde = matriz[1][i] - 2; //Cantidad de celdas verdes
    let cBeige = matriz[2][i]; // Cantidad de celdas beige


    //Pintar en gris hasta que encuentra una celda verde
    let j = 0;
    let apuntadorAnterior = matriz[0][i - 1].cells[j];

    while (!apuntadorAnterior.style.backgroundColor === "#8bbf88") {
      paint(fila, 1, "gris");
      j++;
      apuntadorAnterior = matriz[0][i - 1].cells[j];
    }
    paint(fila, 1, "verde");
    if (matriz[0][i - 1].cells[j + 1].style.backgroundColor === "#e0d1ba") {
      ioTimeAll--;
    }
    j += 2;
    apuntadorAnterior = matriz[0][i - 1].cells[j];
    let tamanoAnterior = matriz[3][i - 1];


    let x = 1;

    while (x <= tamanoAnterior - 2) {
      if (!apuntadorAnterior.style.backgroundColor !== "#e0d1ba") {
        if (cVerde > 0) {
          paint(fila, 1, "verde");
          cVerde--;
          ioTimeAll--;
        } else if (cVerde === 0 && cBeige > 0) {
          paint(fila, 1, "beige");
          cBeige--;
        }
      } else if (apuntadorAnterior.style.backgroundColor === "#8bbf88") {
        if (cBeige > 0) {
          ioTimeAll--;
          paint(fila, 1, "beige");
          cBeige--;
        } else if (cBeige === 0 && cVerde > 0) {
          paint(fila, 1, "verde");
          cVerde--;
        }
      }
      j++;
      apuntadorAnterior = matriz[0][i - 1].cells[j];
      x++;
    }

    paint(fila, 1, "verde");
  }

  let totalC = maxCeldas(tabla) - 1;
  //Terminar las celdas de gris
  for (let n = 1; n < tabla.rows.length; n++) {
    const row = tabla.rows[n];
    let tamanoReal = row.cells.length - 1;
    if (tamanoReal < totalC) {
      paint(row, totalC - tamanoReal, "gris");
    }
  }

  cTitulo.setAttribute("colspan", totalC);

  colAndRow(null, tabla, totalC, 4);

  const rows = tabla.rows;
  const row = rows[tabla.rows.length - 1];
  const target = rows[1];
  tabla.insertBefore(row, target);

    showFormulaMulti(matriz, tabla, false);
});



function maxCeldas(table) {
  let maxCells = 0;
  for (let i = 0; i < table.rows.length; i++) {
    const cellsInRow = table.rows[i].cells.length;
    if (cellsInRow > maxCells) {
      maxCells = cellsInRow;
    }
  }
  return maxCells;
}

function orderMatriz(matrizDatos) {
  const nuevaMatriz = [...matrizDatos]; // Crear copia de matriz original

  nuevaMatriz.sort((row1, row2) => { // Ordenar nueva matriz
    const sumRow1 = row1.reduce((acc, cur) => {
      if (!isNaN(cur)) {
        return acc + Number(cur); // Sumar si es número
      }
      return acc; // Mantener acumulador si no es número
    }, 0);
    const sumRow2 = row2.reduce((acc, cur) => {
      if (!isNaN(cur)) {
        return acc + Number(cur);
      }
      return acc;
    }, 0);
    return sumRow2 - sumRow1; // Ordenar de mayor a menor
  });

  return nuevaMatriz; // Devolver nueva matriz ordenada
}

function orderForQuantity(matriz) {
  for (let i = 0; i < matriz[0].length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < matriz[0].length; j++) {
      if (matriz[0][j].cells.length < matriz[0][min].cells.length) {
        min = j;
      }
    }
    if (min !== i) {
      for (let k = 0; k < matriz.length; k++) {
        let temp = matriz[k][i];
        matriz[k][i] = matriz[k][min];
        matriz[k][min] = temp;
      }
    }
  }
}

function showFormulaMulti(matriz, tabla, cant) {
  let beigeGreen = 0; //Beige without green
  let celdasBeige = tabla.querySelectorAll("td[style*='#e0d1ba']");

  celdasBeige.forEach(celdaBeige => {
    let columna = celdaBeige.cellIndex;
    let celdasVerdeEnColumna = tabla.querySelectorAll(`td:nth-child(${columna + 1})[style*='#8bbf88']`);
    if (celdasVerdeEnColumna.length === 0) {
      beigeGreen++;
    }
  });

  let ioTime = beigeGreen;
  let sumCPU = 0;
  let numerador = "";
  let denominador = beigeGreen;

  // Calcular la suma de los tiempos de CPU y generar el numerador de la fórmula
  for (let i = 0; i < matriz[1].length; i++) {
    sumCPU += Number(matriz[1][i]);
    numerador += matriz[1][i];
    if (i !== matriz[1].length - 1) {
      numerador += "+";
    }
  }

  // Generar la fórmula con los valores calculados
  let cpuUtilization = sumCPU / (sumCPU + ioTime) * 100;
  let formula = `\CPU / Utilization = \\frac{${numerador}}{${numerador}+${denominador}} = \\frac{${sumCPU}}{${sumCPU}+${ioTime}} = ${cpuUtilization}\\%`;

  // Actualizar el contenido del contenedor de la fórmula en el HTML
  let contenedor = document.getElementById(cant ? "formulaUni" : "formulaMulti");
  contenedor.innerHTML = '$$' + formula + '$$';
  MathJax.typesetPromise([contenedor]);
}