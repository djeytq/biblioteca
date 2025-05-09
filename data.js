// Dados de exemplo (simula um banco de dados)
const books = [
    {
        id: 1,
        title: "Dom Casmurro",
        author: "Machado de Assis",
        category: "fiction",
        description: "Um clássico da literatura brasileira que explora temas de ciúme e traição.",
        status: "available",
        owner: "admin",
        borrower: null
    },
    {
        id: 2,
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        category: "fiction",
        description: "Uma obra poética que aborda temas como amor, amizade e o sentido da vida.",
        status: "borrowed",
        owner: "admin",
        borrower: "maria"
    },
    {
        id: 3,
        title: "Sapiens: Uma Breve História da Humanidade",
        author: "Yuval Noah Harari",
        category: "history",
        description: "Uma narrativa sobre a história da humanidade, desde o surgimento do Homo sapiens até o presente.",
        status: "available",
        owner: "admin",
        borrower: null
    },
    {
        id: 4,
        title: "Algoritmos para Viver",
        author: "Brian Christian e Tom Griffiths",
        category: "technology",
        description: "Uma exploração de como os algoritmos computacionais podem ser aplicados na vida cotidiana.",
        status: "available",
        owner: "joao",
        borrower: null
    },
    {
        id: 5,
        title: "Uma Breve História do Tempo",
        author: "Stephen Hawking",
        category: "science",
        description: "Hawking explora conceitos fundamentais de cosmologia e física.",
        status: "borrowed",
        owner: "ana",
        borrower: "joao"
    },
    {
        id: 6,
        title: "O Gene Egoísta",
        author: "Richard Dawkins",
        category: "science",
        description: "Uma abordagem à teoria da evolução sob a perspectiva do gene.",
        status: "available",
        owner: "pedro",
        borrower: null
    }
];
async function fetchBooks() {
const data= await fetch("https://biblioteca-api-zeta.vercel.app/books")
    .then(response => response.json())
    .then(data => {
        // Processar os dados recebidos
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error("Erro ao buscar os dados:", error);
    });
    return data;
}
// Usuários de exemplo
const users = [
    {
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        password: "admin123"
    },
    {
        id: 2,
        name: "João Silva",
        email: "joao@example.com",
        password: "joao123"
    },
    {
        id: 3,
        name: "Maria Souza",
        email: "maria@example.com",
        password: "maria123"
    }
];

// Exportar dados para uso em app.js
export { books, users, fetchBooks };