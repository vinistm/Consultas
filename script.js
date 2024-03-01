


function carregarDados() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var dados = JSON.parse(this.responseText);
        console.log(dados);
        exibirDados(dados);
      }
    };
    xhttp.open("GET", "http://localhost:3003/dados", true); 
    xhttp.send();
  }

  function exibirDados(dados) {
    var tabelaBody = document.getElementById("dadosTable").getElementsByTagName('tbody')[0];

    tabelaBody.innerHTML = '';

    dados.forEach(function(dado) {
      var row = tabelaBody.insertRow();
        row.insertCell(0).innerHTML = dado.GRUPO;
        row.insertCell(1).innerHTML = dado.DESC_FASE_PRODUCAO;
        row.insertCell(2).innerHTML = dado.COLECAO;
        row.insertCell(3).innerHTML = dado.GRUPO_PRODUTO;
        row.insertCell(4).innerHTML = dado.PRODUTO;
        row.insertCell(5).innerHTML = dado.DESC_PRODUTO;
        row.insertCell(6).innerHTML = dado.COR_PRODUTO;
        row.insertCell(7).innerHTML = dado.DESC_COR_PRODUTO;
    row.insertCell(8).innerHTML = dado.COD_FORNECEDOR;
    row.insertCell(9).innerHTML = dado.FORNECEDOR;
    row.insertCell(10).innerHTML = dado.MATERIAL;
    row.insertCell(11).innerHTML = dado.DESC_MATERIAL;
    row.insertCell(12).innerHTML = dado.GRADE;
    row.insertCell(13).innerHTML = dado.COR_MATERIAL;
    row.insertCell(14).innerHTML = dado.DESC_COR_MATERIAL;
    row.insertCell(15).innerHTML = dado.UNID_FICHA_TEC;
    row.insertCell(16).innerHTML = dado.CUSTO_REPOSICAO;
    row.insertCell(17).innerHTML = dado.CONSUMO;
     
    });
  }

  
  window.onload = carregarDados;