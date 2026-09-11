

package com.loja.mvcloja.controller.product;

import com.loja.mvcloja.repository.ProdutoRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Servlet responsável por remover um produto da base de dados.
 *
 * <p>Recebe o ID do produto via parâmetro GET e utiliza o
 * {@link ProdutoRepository} para realizar a exclusão.</p>
 *
 * <p>Após a remoção, o utilizador é encaminhado para a página de listagem
 * de produtos.</p>
 */
@WebServlet("/delete")
public class DeleteProductServlet extends HttpServlet {

    /**
     * Repositório responsável pelas operações de persistência de produtos.
     */
    private ProdutoRepository repo = new ProdutoRepository();

    /**
     * Processa requisições GET para exclusão de produtos.
     *
     * <p>Fluxo:</p>
     * <ol>
     *     <li>Obtém o ID do produto a partir do parâmetro {@code id}.</li>
     *     <li>Converte o ID para inteiro.</li>
     *     <li>Remove o produto correspondente da base de dados.</li>
     *     <li>Encaminha o utilizador para a página de listagem de produtos.</li>
     * </ol>
     *
     * @param req  Objeto contendo os dados da requisição
     * @param resp Objeto utilizado para enviar a resposta ao cliente
     * @throws ServletException Em caso de erro interno do servlet
     * @throws IOException Em caso de falha no encaminhamento
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String id = req.getParameter("id");
        int id_num = Integer.parseInt(id);

        repo.delete(id_num);

        req.getRequestDispatcher("/produtos").forward(req, resp);
    }
}
