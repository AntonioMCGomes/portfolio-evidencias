
package com.loja.mvcloja.controller.user;

import com.loja.mvcloja.repository.UtilizadorRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Servlet responsável por autenticar utilizadores no sistema.
 *
 * <p>Recebe as credenciais enviadas via formulário (POST), valida-as através
 * do {@link UtilizadorRepository} e, em caso de sucesso, cria uma sessão
 * armazenando o email do utilizador autenticado.</p>
 *
 * <p>Se as credenciais forem inválidas, o utilizador é redirecionado para a
 * página de login com um parâmetro de erro.</p>
 */
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações relacionadas aos utilizadores.
     */
    private UtilizadorRepository repo = new UtilizadorRepository();

    /**
     * Processa requisições POST para autenticação de utilizadores.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém email e password enviados pelo formulário.</li>
     *     <li>Valida as credenciais utilizando o método {@code login()}.</li>
     *     <li>Se válidas, cria uma sessão e armazena o email do utilizador.</li>
     *     <li>Redireciona para a página de produtos.</li>
     *     <li>Se inválidas, redireciona para o login com mensagem de erro.</li>
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

        String email = req.getParameter("email");
        String password = req.getParameter("password");

        // Verificar credenciais
        if (repo.login(email, password) != null) {

            HttpSession sessao = req.getSession();
            sessao.setAttribute("user", email);

            resp.sendRedirect("produtos");

        } else {
            resp.sendRedirect("login.jsp?erro=1");
        }
    }
}
