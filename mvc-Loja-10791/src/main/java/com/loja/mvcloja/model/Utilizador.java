
package com.loja.mvcloja.model;

import jakarta.persistence.*;

/**
 * Representa um utilizador do sistema.
 * Cada utilizador possui nome, email único e password.
 *
 * <p>Esta entidade é persistida na tabela {@code Utilizadores}.</p>
 */
@Entity
@Table(name = "Utilizadores")
public class Utilizador {

    /**
     * Identificador único do utilizador.
     * Gerado automaticamente pela base de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Nome completo do utilizador.
     * Campo obrigatório com limite de 80 caracteres.
     */
    @Column(nullable = false, length = 80)
    private String nome;

    /**
     * Email do utilizador.
     * Deve ser único e não pode ser nulo.
     * Utilizado para login e identificação.
     */
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    /**
     * Password do utilizador.
     * Armazenada como texto simples (idealmente deve ser encriptada).
     */
    @Column(nullable = false, length = 255)
    private String password;

    /** Construtor padrão exigido pelo JPA. */
    public Utilizador() {}

    /**
     * Construtor completo para criação de utilizadores.
     *
     * @param nome Nome do utilizador
     * @param email Email único do utilizador
     * @param password Password do utilizador
     */
    public Utilizador(String nome, String email, String password) {
        this.nome = nome;
        this.email = email;
        this.password = password;
    }

    /** @return ID do utilizador */
    public Integer getId() { return id; }

    /** @param id Define o ID do utilizador */
    public void setId(Integer id) { this.id = id; }

    /** @return Nome do utilizador */
    public String getNome() { return nome; }

    /** @param nome Define o nome do utilizador */
    public void setNome(String nome) { this.nome = nome; }

    /** @return Email do utilizador */
    public String getEmail() { return email; }

    /** @param email Define o email do utilizador */
    public void setEmail(String email) { this.email = email; }

    /** @return Password do utilizador */
    public String getPassword() { return password; }

    /** @param password Define a password do utilizador */
    public void setPassword(String password) { this.password = password; }
}
