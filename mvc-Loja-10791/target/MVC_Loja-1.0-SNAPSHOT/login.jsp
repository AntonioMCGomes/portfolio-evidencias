<%--
  Created by IntelliJ IDEA.
  User: marxm
  Date: 28/05/2026
  Time: 10:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<html>
<head>
    <title>Login</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }

        .container {
            background: white;
            padding: 35px 45px;
            border-radius: 10px;
            width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 26px;
            color: #222;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 10px;
        }

        label {
            text-align: left;
            font-size: 14px;
            color: #555;
        }

        input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 15px;
            transition: 0.2s;
        }

        input:focus {
            border-color: #007bff;
            outline: none;
        }

        button {
            margin-top: 10px;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: 0.2s;
        }

        button:hover {
            background: #0056b3;
        }

        p {
            margin-top: 15px;
            font-size: 14px;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .erro {
            color: red;
            margin-bottom: 10px;
            font-size: 14px;
        }
    </style>

</head>
<body>

<div class="container">
    <h1>Entrar</h1>

    <% if("1".equals(request.getParameter("erro"))) { %>
    <p class="erro">Email ou password inválidos.</p>
    <% } %>

    <form action="login" method="post">
        <label>Email:</label>
        <input type="email" name="email" required>

        <label>Password:</label>
        <input type="password" name="password" required>

        <button type="submit">Entrar</button>
    </form>

    <p>Novo aqui? <a href="registro.jsp">Criar conta</a></p>
</div>

</body>
</html>



