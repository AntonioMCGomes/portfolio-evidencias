package com.loja.mvcloja.repository;

import com.loja.mvcloja.model.Produto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;

import java.util.List;

/**
 * Repositório responsável por operações de persistência relacionadas à entidade {@link Produto}.
 *
 * <p>Utiliza JPA com {@link EntityManager} para realizar operações CRUD
 * e consultas personalizadas.</p>
 *
 * <p>O repositório instancia um {@link EntityManagerFactory} baseado na
 * unidade de persistência {@code lojaPU}.</p>
 */
public class ProdutoRepository {

    /**
     * Fábrica de EntityManagers utilizada para criar conexões com a base de dados.
     */
    private EntityManagerFactory emf;

    /**
     * Construtor padrão que inicializa o EntityManagerFactory
     * com a unidade de persistência configurada.
     */
    public ProdutoRepository() {
        emf = Persistence.createEntityManagerFactory("lojaPU");
    }

    /**
     * Insere um novo produto na base de dados.
     *
     * @param p Produto a ser persistido
     * @throws RuntimeException caso ocorra erro durante a transação
     */
    public void insert(Produto p) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(p);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    /**
     * Busca um produto pelo seu ID.
     *
     * @param id Identificador do produto
     * @return Produto encontrado ou {@code null} caso não exista
     */
    public Produto findById(Integer id) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(Produto.class, id);
        } finally {
            em.close();
        }
    }

    /**
     * Atualiza um produto existente na base de dados.
     *
     * @param p Produto com os novos valores
     * @return Instância atualizada do produto
     * @throws RuntimeException caso ocorra erro durante a transação
     */
    public Produto update(Produto p) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Produto atualizado = em.merge(p);
            tx.commit();
            return atualizado;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    /**
     * Remove um produto da base de dados pelo seu ID.
     *
     * @param id Identificador do produto a ser removido
     * @throws RuntimeException caso ocorra erro durante a transação
     */
    public void delete(Integer id) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Produto p = em.find(Produto.class, id);
            if (p != null) {
                em.remove(p);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    /**
     * Retorna todos os produtos associados a um utilizador específico,
     * filtrando pelo email do utilizador.
     *
     * @param email Email do utilizador dono dos produtos
     * @return Lista de produtos ordenados por ID em ordem decrescente
     */
    public List<Produto> findByEmail(String email) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery(
                            "SELECT p FROM Produto p WHERE utilizador.email = :e ORDER BY p.id DESC",
                            Produto.class
                    )
                    .setParameter("e", email)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}
