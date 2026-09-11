package com.loja.mvcloja.controller.user;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Servlet responsável por encerrar a sessão do utilizador.
 *
 * <p>Ao receber uma requisição GET, este servlet invalida a sessão atual,
 * removendo todas as informações associadas ao utilizador autenticado,
 * e redireciona o cliente para a página de login.</p>
 *
 * <p>Este processo garante que o utilizador seja desconectado de forma
 * segura e que nenhuma informação sensível permaneça ativa na sessão.</p>
 */
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

    /**
     * Processa requisições GET para realizar o logout do utilizador.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém a sessão atual.</li>
     *     <li>Invalida a sessão, removendo todos os atributos.</li>
     *     <li>Redireciona o utilizador para a página de login.</li>
     * </ol>
     *
     * @param req  Objeto contendo os dados da requisição
     * @param resp Objeto utilizado para enviar a resposta ao cliente
     * @throws ServletException Em caso de erro interno do servlet
     * @throws IOException Em caso de falha no redirecionamento
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        HttpSession sessao = req.getSession();
        sessao.invalidate();

        resp.sendRedirect("login.jsp");
    }
}
