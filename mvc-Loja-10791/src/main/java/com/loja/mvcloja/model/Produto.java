package com.loja.mvcloja.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Representa um produto disponível na loja.
 * Cada produto possui nome, preço, quantidade em stock
 * e está associado a um utilizador (dono/criador do registo).
 *
 * <p>Esta entidade é persistida na tabela {@code Produtos}.</p>
 */
@Entity
@Table(name = "Produtos")
public class Produto {

    /**
     * Identificador único do produto.
     * Gerado automaticamente pela base de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Nome do produto.
     * Não pode ser nulo e possui limite de 120 caracteres.
     */
    @Column(nullable = false, length = 120)
    private String nome;

    /**
     * Preço do produto.
     * Armazenado com precisão de 10 dígitos e 2 casas decimais.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    /**
     * Quantidade disponível em stock.
     * Não pode ser nula.
     */
    @Column(nullable = false)
    private Integer stock;

    /**
     * Utilizador responsável pelo cadastro do produto.
     * Relacionamento muitos-para-um.
     */
    @ManyToOne
    @JoinColumn(nullable = false, name = "utilizador_id")
    private Utilizador utilizador;

    /** Construtor padrão exigido pelo JPA. */
    public Produto() {}

    /**
     * Construtor completo para criação de produtos.
     *
     * @param nome Nome do produto
     * @param preco Preço do produto
     * @param stock Quantidade em stock
     * @param utilizador Utilizador associado ao produto
     */
    public Produto(String nome, BigDecimal preco, Integer stock, Utilizador utilizador) {
        this.nome = nome;
        this.preco = preco;
        this.stock = stock;
        this.utilizador = utilizador;
    }

    // Getters e Setters

    /** @return ID do produto */
    public Integer getId() { return id; }

    /** @param id Define o ID do produto */
    public void setId(Integer id) { this.id = id; }

    /** @return Nome do produto */
    public String getNome() { return nome; }

    /** @param nome Define o nome do produto */
    public void setNome(String nome) { this.nome = nome; }

    /** @return Preço do produto */
    public BigDecimal getPreco() { return preco; }

    /** @param preco Define o preço do produto */
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    /** @return Quantidade em stock */
    public Integer getStock() { return stock; }

    /** @param stock Define a quantidade em stock */
    public void setStock(Integer stock) { this.stock = stock; }

    /** @return Utilizador associado ao produto */
    public Utilizador getUtilizador() { return utilizador; }

    /** @param u Define o utilizador associado ao produto */
    public void setUtilizador(Utilizador u) { this.utilizador = u; }
}
