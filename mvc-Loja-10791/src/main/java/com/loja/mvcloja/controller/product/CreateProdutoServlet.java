
package com.loja.mvcloja.controller.product;

import com.loja.mvcloja.model.Produto;
import com.loja.mvcloja.model.Utilizador;
import com.loja.mvcloja.repository.ProdutoRepository;
import com.loja.mvcloja.repository.UtilizadorRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;

/**
 * Servlet responsável por criar novos produtos no sistema.
 *
 * <p>Recebe os dados enviados via formulário (POST), valida o utilizador
 * autenticado através da sessão e persiste o produto utilizando o
 * {@link ProdutoRepository}.</p>
 *
 * <p>Em caso de sucesso, redireciona para a página de listagem de produtos.
 * Em caso de erro, redireciona para a página de login.</p>
 */
@WebServlet("/create_product")
public class CreateProdutoServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações de persistência de produtos.
     */
    private ProdutoRepository repo = new ProdutoRepository();

    /**
     * Repositório responsável pelas operações relacionadas aos utilizadores.
     */
    private UtilizadorRepository user_repo = new UtilizadorRepository();

    /**
     * Processa requisições POST para criação de novos produtos.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém os parâmetros enviados pelo formulário.</li>
     *     <li>Recupera o utilizador autenticado através da sessão.</li>
     *     <li>Cria uma instância de {@link Produto} com os dados fornecidos.</li>
     *     <li>Persiste o produto na base de dados.</li>
     *     <li>Redireciona para a página de produtos.</li>
     * </ol>
     *
     * <p>Se ocorrer qualquer exceção (incluindo sessão expirada), o utilizador
     * é redirecionado para a página de login.</p>
     *
     * @param req  Objeto contendo os dados da requisição
     * @param resp Objeto utilizado para enviar a resposta ao cliente
     * @throws ServletException Em caso de erro interno do servlet
     * @throws IOException Em caso de falha no redirecionamento
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String name = req.getParameter("name");
        String price = req.getParameter("price");
        String stock = req.getParameter("stock");

        try {
            // Recuperar utilizador autenticado
            String email = (String) req.getSession().getAttribute("user");
            Utilizador u = user_repo.findByEmail(email);

            // Criar novo produto
            Produto newproduct = new Produto(
                    name,
                    BigDecimal.valueOf(Double.parseDouble(price)),
                    Integer.valueOf(stock),
                    u
            );

            // Persistir produto
            repo.insert(newproduct);

            resp.sendRedirect("produtos");

        } catch (Exception e) {
            resp.sendRedirect("login.jsp");
        }
    }
}
