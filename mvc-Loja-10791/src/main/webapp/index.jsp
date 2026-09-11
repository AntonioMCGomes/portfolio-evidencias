<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Loja - Produtos</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #333;
        }

        h1 {
            margin-bottom: 5px;
            font-size: 28px;
            color: #222;
        }

        h3 {
            margin-top: 0;
            font-weight: normal;
            color: #555;
        }

        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 18px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            transition: 0.2s ease-in-out;
        }

        a:hover {
            background: #0056b3;
        }

        /* Caixa central */
        .container {
            background: white;
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
        }
    </style>

</head>
<body>

<div class="container">
    <h1>Projeto exemplo de operações CRUD</h1>
    <h3>Login</h3>
    <a href="login.jsp">Ir para Login</a>
</div>

</body>
</html>
