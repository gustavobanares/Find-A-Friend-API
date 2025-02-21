

# Pet Adoption App

## Requisitos Funcionais (RFs)

- [x] Deve ser possível cadastrar um pet;
- [x] Deve ser possível se cadastrar como uma ORG;
- [x] Deve ser possível realizar login como uma ORG;
- [x] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade;
- [x] Deve ser possível filtrar pets por suas características;
- [x] Deve ser possível visualizar detalhes de um pet para adoção;


## Regras de Negócio (RNs)

- [x] Para listar os pets, obrigatoriamente precisamos informar a cidade;
- [x] Uma ORG precisa ter um endereço e um número de WhatsApp;
- [x] Um pet deve estar vinculado a uma ORG;
- [x] O usuário que deseja adotar um pet entrará em contato com a ORG via WhatsApp;
- [x] Todos os filtros, além da cidade, são opcionais;
- [x] Para uma ORG acessar a aplicação como admin, ela precisa estar logada;

## Requisitos Não Funcionais (RNFs)

- [x] A senha da ORG deve estar criptografada;
- [x] Os dados da aplicação precisam estar armazenados em um banco de dados;
- [] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] A ORG deve ser identificada por um JWT (JSON Web Token);