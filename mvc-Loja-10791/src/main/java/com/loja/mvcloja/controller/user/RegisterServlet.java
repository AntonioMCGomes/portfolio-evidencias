package com.loja.mvcloja.controller.user;

import com.loja.mvcloja.model.Utilizador;
import com.loja.mvcloja.repository.UtilizadorRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Servlet responsável por registar novos utilizadores no sistema.
 *
 * <p>Recebe os dados enviados via formulário (POST), cria uma instância de
 * {@link Utilizador} e delega ao {@link UtilizadorRepository} a tarefa de
 * persistir o novo utilizador na base de dados.</p>
 *
 * <p>Após o registo, o utilizador é redirecionado para a página de login.</p>
 */
@WebServlet("/registo")
public class RegisterServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações de persistência de utilizadores.
     */
    private UtilizadorRepository repo = new UtilizadorRepository();

    /**
     * Processa requisições POST para registo de novos utilizadores.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém nome, email e password enviados pelo formulário.</li>
     *     <li>Cria um novo objeto {@link Utilizador}.</li>
     *     <li>Persiste o utilizador na base de dados.</li>
     *     <li>Redireciona para a página de login.</li>
     * </ol>
     *
     * @param req  Objeto contendo os dados da requisição
     * @param resp Objeto utilizado para enviar a resposta ao cliente
     * @throws ServletException Em caso de erro interno do servlet
     * @throws IOException Em caso de falha no redirecionamento
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String nome = req.getParameter("name");
        String email = req.getParameter("email");
        String pass = req.getParameter("password");

        Utilizador u = new Utilizador(nome, email, pass);

        repo.insert(u);

        resp.sendRedirect("login.jsp");
    }
}

