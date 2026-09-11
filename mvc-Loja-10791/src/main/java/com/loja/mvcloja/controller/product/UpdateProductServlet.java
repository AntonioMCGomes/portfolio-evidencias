package com.loja.mvcloja.controller.product;

import com.loja.mvcloja.model.Produto;
import com.loja.mvcloja.repository.ProdutoRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;

/**
 * Servlet responsável por atualizar os dados de um produto existente.
 *
 * <p>Recebe os dados enviados via formulário (POST), busca o produto pelo ID,
 * atualiza os campos modificados e persiste as alterações utilizando o
 * {@link ProdutoRepository}.</p>
 *
 * <p>Após a atualização, o utilizador é redirecionado para a página de listagem
 * de produtos.</p>
 */
@WebServlet("/update")
public class UpdateProductServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações de persistência de produtos.
     */
    private ProdutoRepository repo = new ProdutoRepository();

    /**
     * Processa requisições POST para atualização de produtos.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém os parâmetros enviados pelo formulário.</li>
     *     <li>Busca o produto existente pelo ID.</li>
     *     <li>Atualiza os campos nome, preço e stock.</li>
     *     <li>Persiste as alterações na base de dados.</li>
     *     <li>Redireciona para a página de produtos.</li>
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

        String id = req.getParameter("id");
        String name = req.getParameter("name");
        String price = req.getParameter("price");
        String stock = req.getParameter("stock");

        // Buscar produto existente
        Produto p = repo.findById(Integer.valueOf(id));

        // Atualizar campos
        p.setNome(name);
        p.setPreco(BigDecimal.valueOf(Double.parseDouble(price)));
        p.setStock(Integer.valueOf(stock));

        // Persistir alterações
        repo.update(p);

        resp.sendRedirect(req.getContextPath() + "/produtos");
    }
}


