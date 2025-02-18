# App

Pet Adoption App

## Requisitos Funcionais (RFs)

- [] Deve ser possível cadastrar um pet;
- [] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade;
- [] Deve ser possível filtrar pets por suas características;
- [] Deve ser possível visualizar detalhes de um pet para adoção;
- [] Deve ser possível se cadastrar como uma ORG;
- [] Deve ser possível realizar login como uma ORG;

## Regras de Negócio (RNs)

- [] Para listar os pets, obrigatoriamente precisamos informar a cidade;
- [] Uma ORG precisa ter um endereço e um número de WhatsApp;
- [] Um pet deve estar vinculado a uma ORG;
- [] O usuário que deseja adotar um pet entrará em contato com a ORG via WhatsApp;
- [] Todos os filtros, além da cidade, são opcionais;
- [] Para uma ORG acessar a aplicação como admin, ela precisa estar logada;

## Requisitos Não Funcionais (RNFs)

- [] A senha da ORG deve estar criptografada;
- [] Os dados da aplicação precisam estar armazenados em um banco de dados;
- [] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [] A ORG deve ser identificada por um JWT (JSON Web Token);