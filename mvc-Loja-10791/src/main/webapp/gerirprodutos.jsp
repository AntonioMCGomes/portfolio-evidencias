<%--
  Created by IntelliJ IDEA.
  User: marxm
  Date: 26/05/2026
  Time: 13:23
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!--
Página: gerirprodutos.jsp
Função: Exibir, criar, editar e apagar produtos do utilizador autenticado.

Dados recebidos:
- produtos (List<Produto>) → enviado pelo ReadProdutosServlet (/produtos)

Servlets envolvidos:
- /create_product  → CreateProdutoServlet (criar novo produto)
- /update          → UpdateProductServlet (editar produto existente)
- /delete          → DeleteProductServlet (apagar produto)
- /logout          → LogoutServlet (terminar sessão)

Fluxo:
1. ReadProdutosServlet verifica sessão e envia lista de produtos.
2. Esta página exibe formulário de criação e tabela de edição.
3. Cada linha da tabela permite editar ou apagar um produto.
-->

<html>
<head>
    <title>Lista de produtos</title>

    <style>
        /* Estilos visuais da página (layout, botões, tabela, etc.) */
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .top-bar a {
            padding: 8px 14px;
            background: #dc3545;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: 0.2s;
        }

        .top-bar a:hover {
            background: #b52a37;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        h3 {
            margin-top: 0;
            color: #222;
        }

        form {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        label {
            font-size: 14px;
            color: #555;
        }

        input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            width: 150px;
        }

        input:focus {
            border-color: #007bff;
            outline: none;
        }

        /* Botões padronizados */
        button,
        .edit-btn,
        .delete-btn {
            padding: 10px 18px;
            min-width: 90px;
            height: 38px;
            font-size: 14px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: 0.2s;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }

        .edit-btn {
            background: #007bff;
            color: white;
        }

        .edit-btn:hover {
            background: #0056b3;
        }

        .delete-btn {
            background: #dc3545;
            color: white;
        }

        .delete-btn:hover {
            background: #b52a37;
        }

        /* Tabela de produtos */
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        th {
            background: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        tr:hover {
            background: #f9f9f9;
        }

        .actions {
            display: flex;
            gap: 8px;
        }
    </style>

</head>
<body>

<!-- Barra superior com título e botão de logout -->
<div class="top-bar">
    <h2>Gestão de Produtos</h2>
    <a href="logout">Logout</a>
</div>

<!-- Card com formulário para criar novo produto -->
<div class="card">
    <h3>Criar Produto</h3>

    <!--
        Formulário de criação de produto
        Envia dados para CreateProdutoServlet (/create_product)
    -->
    <form action="create_product" method="post">
        <label for="name">Nome:</label>
        <input type="text" name="name" id="name">

        <label for="price">Preço:</label>
        <input type="number" name="price" id="price">

        <label for="stock">Stock:</label>
        <input type="number" name="stock" id="stock">

        <button class="edit-btn" type="submit">Criar Produto</button>
    </form>
</div>

<!-- Tabela que lista todos os produtos do utilizador -->
<table>
    <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Preço</th>
        <th>Stock</th>
        <th>Ações</th>
    </tr>

    <!--
        Loop JSTL que percorre a lista de produtos enviada pelo servlet
        Cada linha permite editar ou apagar o produto
    -->
    <c:forEach var="p" items="${produtos}">
        <tr>

            <!-- Formulário de edição (UpdateProductServlet /update) -->
            <form action="update" method="post">
                <td>${p.id}</td>

                <td><input name="name" value="${p.nome}"></td>
                <td><input name="price" value="${p.preco}"></td>
                <td><input name="stock" value="${p.stock}"></td>

                <td class="actions">
                    <input type="hidden" name="id" value="${p.id}">
                    <button class="edit-btn" type="submit">Editar</button>
            </form>

            <!-- Formulário de apagar (DeleteProductServlet /delete) -->
            <form action="delete" method="get">
                <input type="hidden" name="id" value="${p.id}">
                <button class="delete-btn" type="submit">Apagar</button>
            </form>

            </td>
        </tr>
    </c:forEach>
</table>

</body>
</html>


