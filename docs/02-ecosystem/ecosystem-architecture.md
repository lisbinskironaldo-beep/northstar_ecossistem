# Ecosystem Architecture

## Regra central

O mercado vera tres produtos.

A empresa operara uma plataforma.

## Camadas do ecossistema

### Camada 1: Marca-mae

Responsavel por:

- visao
- narrativa
- reputacao institucional
- relacao com parceiros
- futuro programa de talentos

### Camada 2: Plataforma central

Responsavel por:

- identidade e autenticacao
- workspace de creator
- multiartist personas por conta
- perfis
- trust score
- upload pipeline
- storage e distribuicao
- analytics
- antifraude
- moderacao e reports
- camada de acesso de conteudo sensivel
- politicas de direitos

### Camada 3: Produtos publicos

- `Echo`: consumo recorrente, descoberta musical, acervo base
- `Pulse`: viralizacao, alcance, fama
- `Lumen`: prestigio, conteudo longo, camada premium

### Camada 4: Talent layer

Responsavel por:

- creator score
- radar de talentos
- relacao com criadores em ascensao
- contratos futuros
- distribuicao futura

## Ordem de crescimento

1. `Echo`
2. `Pulse`
3. `Lumen`

## Razao da ordem

- `Echo` valida o modelo com menor custo
- `Pulse` amplia aquisicao e descoberta
- `Lumen` exige mais custo, mais marca e creators mais fortes

## Regras de integracao

- mesma conta pode servir para as tres frentes
- mesmo workspace de creator pode operar nas tres frentes
- a mesma conta pode ter multiplos artistas ou personas publicas
- mesmos mecanismos de confianca governam todas as frentes
- cada frente usa metricas especificas para ranking
- a experiencia do usuario nao precisa parecer conectada

Referencia:

- [creator-ecosystem-layer.md](/c:/dev/northstar_ecosystem/docs/02-ecosystem/creator-ecosystem-layer.md)

## Regras de isolamento

Se uma frente tiver problema:

- nao pode arrastar todas visualmente
- nao pode contaminar a proposta de valor das outras
- nao pode expor usuario premium a acervo fraco
