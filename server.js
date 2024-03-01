const express = require('express');
const sql = require('mssql');

const app = express();
const PORT = 3003;

const config = {
  user: 'TESTE',
  password: 'T@123',
  server: '192.168.100.91',
  database: 'linx_lafort',
  options: {
    encrypt: false, 
    trustServerCertificate: true 
  }
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/dados', async (req, res) => {
  try {
    await sql.connect(config);

    const result = await sql.query(`
      SELECT m.GRUPO,prf.DESC_FASE_PRODUCAO,p.COLECAO,p.GRUPO_PRODUTO,p.PRODUTO,p.DESC_PRODUTO,pc.COR_PRODUTO,pc.DESC_COR_PRODUTO,fo.COD_FORNECEDOR,fo.FORNECEDOR,m.MATERIAL,m.DESC_MATERIAL, pb.GRADE,mc.COR_MATERIAL,mc.DESC_COR_MATERIAL,m.UNID_FICHA_TEC, m.CUSTO_REPOSICAO,
      CASE pb.TAMANHO        WHEN 1 THEN pf.C1        WHEN 2 THEN pf.C2        WHEN 3 THEN pf.C3        WHEN 4 THEN pf.C4        WHEN 5 THEN pf.C5        WHEN 6 THEN pf.C6        WHEN 7 THEN pf.C7        WHEN 8 THEN pf.C8        ELSE NULL    END AS CONSUMO
      FROM PRODUTOS_BARRA pb
      JOIN PRODUTOS_FICHA pf ON pf.PRODUTO = pb.PRODUTO
      JOIN MATERIAIS m ON pf.MATERIAL = m.MATERIAL
      JOIN PRODUTO_CORES pc ON pc.PRODUTO = pb.PRODUTO AND pc.COR = pb.COR_PRODUTO 
      JOIN PRODUTOS p ON p.PRODUTO = pb.PRODUTO
      JOIN FORNECEDORES fo ON fo.FORNECEDOR = m.FABRICANTE
      JOIN PRODUTOS_FICHA_COR pfc ON pfc.PRODUTO = pb.PRODUTO AND pfc.COR_PRODUTO = pb.COR_PRODUTO AND pfc.MATERIAL = m.MATERIAL
      JOIN MATERIAIS_CORES mc ON pfc.COR_MATERIAL = mc.COR_MATERIAL AND pfc.MATERIAL = mc.MATERIAL
      JOIN COMPRAS_MATERIAL cm ON cm.MATERIAL = m.MATERIAL AND cm.COR_MATERIAL = mc.COR_MATERIAL AND cm.MATERIAL = mc.MATERIAL
      JOIN COMPRAS cc ON cc.PEDIDO = cm.PEDIDO 
      join PRODUTO_VERSAO_MATERIAL pvm on pvm.PRODUTO=p.PRODUTO and pvm.MATERIAL=m.MATERIAL 
      LEFT JOIN ENTRADAS_ITEM c ON c.REFERENCIA = m.MATERIAL AND c.REFERENCIA_ITEM = mc.COR_MATERIAL 
      LEFT JOIN ENTRADAS d ON d.NF_ENTRADA = c.NF_ENTRADA
      join PRODUCAO_FASE prf on prf.FASE_PRODUCAO=m.FASE_PRODUCAO
      WHERE 
        TIPO_COD_BAR = '4' AND (p.COLECAO='ESS' OR  p.COLECAO = 'ver 25' )
         and p.STATUS_PRODUTO not like '03' and p.CONTINUIDADE not like '3'
          AND (cc.TIPO_COMPRA LIKE 'verao 25%' OR cc.TIPO_COMPRA LIKE 'verao 25%')
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao buscar dados:', err.message);
    res.status(500).send('Erro ao buscar dados');
  } finally {
    await sql.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
