package com.loja.mvcloja.repository;

import com.loja.mvcloja.model.Utilizador;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;

/**
 * Repositório responsável pelas operações de persistência relacionadas à entidade {@link Utilizador}.
 *
 * <p>Inclui funcionalidades de cadastro, busca por email e autenticação
 * com verificação de password utilizando BCrypt.</p>
 *
 * <p>Utiliza JPA com {@link EntityManager} para realizar operações na base de dados.</p>
 */
public class UtilizadorRepository {

    /**
     * Fábrica de EntityManagers utilizada para criar conexões com a base de dados.
     */
    private EntityManagerFactory emf;

    /**
     * Construtor padrão que inicializa o EntityManagerFactory
     * com a unidade de persistência configurada.
     */
    public UtilizadorRepository() {
        emf = Persistence.createEntityManagerFactory("lojaPU");
    }

    /**
     * Insere um novo utilizador na base de dados.
     * Antes de persistir, a password é encriptada com BCrypt.
     *
     * @param u Utilizador a ser persistido
     * @throws RuntimeException caso ocorra erro durante a transação
     */
    public void insert(Utilizador u) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            // Encriptar a password antes de salvar
            String hashedPassword = BCrypt.hashpw(u.getPassword(), BCrypt.gensalt(12));
            u.setPassword(hashedPassword);

            em.persist(u);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    /**
     * Busca um utilizador pelo email.
     *
     * @param email Email do utilizador
     * @return Utilizador encontrado ou {@code null} caso não exista
     */
    public Utilizador findByEmail(String email) {
        EntityManager em = emf.createEntityManager();
        try {
            List<Utilizador> lista = em.createQuery(
                            "SELECT u FROM Utilizador u WHERE u.email = :e",
                            Utilizador.class
                    )
                    .setParameter("e", email)
                    .getResultList();

            return lista.isEmpty() ? null : lista.get(0);
        } finally {
            em.close();
        }
    }

    /**
     * Realiza o processo de login verificando email e password.
     * A password fornecida é comparada com o hash armazenado usando BCrypt.
     *
     * @param email Email do utilizador
     * @param password Password em texto simples fornecida no login
     * @return Utilizador autenticado ou {@code null} caso as credenciais sejam inválidas
     */
    public Utilizador login(String email, String password) {
        Utilizador u = findByEmail(email);

        // Verificar password com BCrypt
        if (u != null && BCrypt.checkpw(password, u.getPassword())) {
            return u;
        }
        return null;
    }
}
