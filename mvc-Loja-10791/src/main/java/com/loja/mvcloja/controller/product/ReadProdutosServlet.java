
package com.loja.mvcloja.controller.product;

import com.loja.mvcloja.model.Produto;
import com.loja.mvcloja.repository.ProdutoRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * Servlet responsável por listar os produtos associados ao utilizador autenticado.
 *
 * <p>Este servlet verifica a existência de uma sessão válida, obtém o email do
 * utilizador autenticado e utiliza o {@link ProdutoRepository} para buscar
 * todos os produtos pertencentes a esse utilizador.</p>
 *
 * <p>Os produtos encontrados são enviados para a página
 * {@code gerirprodutos.jsp} através de um atributo de requisição.</p>
 */
@WebServlet("/produtos")
public class ReadProdutosServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações de persistência de produtos.
     */
    private ProdutoRepository repo = new ProdutoRepository();

    /**
     * Processa requisições GET para exibir a lista de produtos do utilizador autenticado.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém a sessão atual.</li>
     *     <li>Verifica se o utilizador está autenticado.</li>
     *     <li>Obtém o email do utilizador a partir da sessão.</li>
     *     <li>Busca os produtos associados ao email.</li>
     *     <li>Encaminha os dados para a página de gestão de produtos.</li>
     * </ol>
     *
     * @param req  Objeto contendo os dados da requisição
     * @param resp Objeto utilizado para enviar a resposta ao cliente
     * @throws ServletException Em caso de erro interno do servlet
     * @throws IOException Em caso de falha no redirecionamento ou encaminhamento
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        HttpSession sessao = req.getSession();

        // Verificar se o utilizador está autenticado
        if (sessao == null || sessao.getAttribute("user") == null) {
            resp.sendRedirect("login.jsp");
            return;
        }

        String email = (String) sessao.getAttribute("user");

        // Buscar produtos do utilizador autenticado
        List<Produto> produtos = repo.findByEmail(email);

        // Enviar lista para a JSP
        req.setAttribute("produtos", produtos);

        req.getRequestDispatcher("/gerirprodutos.jsp").forward(req, resp);
    }
}
