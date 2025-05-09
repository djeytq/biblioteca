import { books, users, fetchBooks } from './data.js';

// Usuário logado atual (null se ninguém estiver logado)
let currentUserString = localStorage.getItem("@book:user") ? localStorage.getItem("@book:user") : null;
let currentUser=currentUserString?JSON.parse(currentUserString):null;

let BOOKSGLOBAL;

// Elementos do DOM
const booksGrid = document.getElementById('booksGrid');
const categoriesList = document.getElementById('categoriesList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Modais
const bookModal = document.getElementById('bookModal');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

// Botões
const addBookBtn = document.getElementById('addBookBtn');
const myBooksBtn = document.getElementById('myBooksBtn');
const myBorrowsBtn = document.getElementById('myBorrowsBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Formulários
const bookForm = document.getElementById('bookForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Botões para fechar modais
const closeButtons = document.querySelectorAll('.close');
const cancelBookBtn = document.getElementById('cancelBookBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');

// Inicialização
function init() {
    loadBooks();
    updateAuthUI();
    addEventListeners();
}

// Carregar livros na grid
async function loadBooks(category = 'all', id) {
    const books=await fetchBooks();
    BOOKSGLOBAL=books;
    booksGrid.innerHTML=" ";
    
    const bookFilter=books.filter(book => {
        switch (category) {
            case 'all':
                if (id) {
                    return book.owner === id;
                }else{
                    return book;
                }
                // return book;
                break;
            case 'Terror':
                if (book.category === 'Terror') return book;
                break;
            case 'Ficção':
                if (book.category === 'Ficção') return book;
                break;
            case 'Romance':
                if (book.category === 'Romance') return book;
                break;
            case 'Aventura':
                if (book.category === 'Aventura') return book;
                break;
            case 'Tecnologia':
                if (book.category === 'Tecnologia') return book;
                break;
            case 'Ciência':
                if (book.category === 'Ciência') return book;
                break;
            case 'Comédia':
                if (book.category === 'Comédia') return book;
                break;
            default:
                return book;
                break;
        }
    });
    
    if (bookFilter.length === 0) {
        booksGrid.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    bookFilter.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <div class="book-cover">${book.title[0].toUpperCase()}</div>
            <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <p class="book-description">${book.description}</p>
            
            <div class="action-buttons">
                <button class="btn btn-primary view-book" data-id="${book.id}">Ver Detalhes</button>
                ${id ? `<button class="deleteBookBtn btn" data-id="${book.id}" id="deleteBookBtn">Eliminar</button>` : ''}
            </div>
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });
    
}

// Adicionar evento aos botões "Ver Detalhes"
booksGrid.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('view-book')) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        viewBookDetails(bookId);
    }
});


// Adicionar event listeners
function addEventListeners() {
    // Filtrar por categoria
    categoriesList.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const category = e.target.getAttribute('data-category');
            loadBooks(category);
        }
    });
    
    // Pesquisar
    // searchButton.addEventListener('click', function() {
    //     const activeCategory = document.querySelector('#categoriesList a.active')?.getAttribute('data-category') || 'all';
    //     loadBooks(activeCategory, searchInput.value);
    // });
    
    // searchInput.addEventListener('keypress', function(e) {
    //     if (e.key === 'Enter') {
    //         const activeCategory = document.querySelector('#categoriesList a.active')?.getAttribute('data-category') || 'all';
    //         loadBooks(activeCategory, searchInput.value);
    //     }
    // });
    
    // Botão adicionar livro
    addBookBtn.addEventListener('click', function() {
        if (!currentUser) {
            alert('Por favor, faça login para adicionar um livro.');
            return;
        }
        
        document.getElementById('bookModalTitle').textContent = 'Adicionar Livro';
        document.getElementById('bookForm').reset();
        bookModal.style.display = 'block';
    });
    
    // Botão meus livros
    myBooksBtn.addEventListener('click', function() {
        if (!currentUser) {
            alert('Por favor, faça login para ver seus livros.');
            return;
        }
        
        loadBooks('all', currentUser.id);
    });

    // Boatão de eliminar livro

    
    // Botão meus empréstimos
    // myBorrowsBtn.addEventListener('click', function() {
    //     if (!currentUser) {
    //         alert('Por favor, faça login para ver seus empréstimos.');
    //         return;
    //     }
        
    //     loadMyBorrows();
    // });
    
    // Botão login
    loginBtn.addEventListener('click', function() {
        if (currentUser) {
            logout();
        } else {
            loginModal.style.display = 'block';
        }
    });
    
    // Botão registro
    registerBtn.addEventListener('click', function() {
        registerModal.style.display = 'block';
    });
    
    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            bookModal.style.display = 'none';
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    cancelBookBtn.addEventListener('click', () => bookModal.style.display = 'none');
    cancelLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');
    cancelRegisterBtn.addEventListener('click', () => registerModal.style.display = 'none');
    
    // Submissão de formulários
    bookForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const category = document.getElementById('bookCategory').value;
        const description = document.getElementById('bookDescription').value;
        
    try {
        const response = await fetch("https://biblioteca-api-zeta.vercel.app/book/insert", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('@book:token')}`
        },
        body: JSON.stringify({
            title,
            author,
            category,
            description,
            owner: currentUser.id
        })
        });

        if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao adicionar livro: ${errorData.message}`);
        return;
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        alert('Ocorreu um erro ao tentar cadastrar o livro. Tente novamente mais tarde.');
    }

        bookModal.style.display = 'none';
        
        loadBooks();
    });
    
    loginForm.addEventListener('submit',async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch("https://biblioteca-api-zeta.vercel.app/session", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro ao registrar: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            alert(data.message);
            console.error(data);
            localStorage.setItem('@book:token', data.token);
            localStorage.setItem('@book:user', JSON.stringify(data.user));
            loginModal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            alert('Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
        }
        login();
    });
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerPasswordConfirm').value;
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        try {
            const response = await fetch("https://biblioteca-api-zeta.vercel.app/session/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro ao registrar: ${errorData.message}`);
                return;
            }

            const data = await response.json();
            alert(data.message);
            console.error(data);
            registerModal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            alert('Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
        }
    });
}

// Adicionar evento ao botão de eliminar livro
booksGrid.addEventListener('click', async function (e) {
    if (e.target && e.target.classList.contains('deleteBookBtn')) {
        const bookId = e.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja eliminar este livro?')) {
            await deleteBook(bookId);
            loadBooks(); // Recarregar os livros após a exclusão
        }
    }
});

async function deleteBook(bookId) {
    try {
        const response = await fetch(`https://biblioteca-api-zeta.vercel.app/book/delete/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('@book:token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao eliminar livro: ${errorData.message}`);
            return;
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro ao eliminar livro:', error);
        alert('Ocorreu um erro ao tentar eliminar o livro. Tente novamente mais tarde.');
    }
}

// Login
function login() {
    const userString = localStorage.getItem("@book:user");
    const user=JSON.parse(userString);
    
    if (user) {
        currentUser = user;
        updateAuthUI();
        alert(`Bem-vindo(a), ${user.name}!`);
    } else {
        alert('Verifique se está logado!');
    }
}

// Logout
function logout() {
    currentUser = null;
    updateAuthUI();
    loadBooks();
    localStorage.removeItem("@book:user");
    localStorage.removeItem("@book:token");
    alert('Você saiu com sucesso!');
}


// Atualizar interface de autenticação
function updateAuthUI() {
    if (currentUser) {
        loginBtn.textContent = 'Sair';
        registerBtn.style.display = 'none';
    } else {
        loginBtn.textContent = 'Entrar';
        registerBtn.style.display = 'block';
    }
}

// Carregar meus livros
function loadMyBooks() {
    if (!currentUser) return;
    
    booksGrid.innerHTML = '';
    
    const myBooks = books.filter(book => book.owner === currentUser.email);
    
    if (myBooks.length === 0) {
        booksGrid.innerHTML = '<p>Você ainda não adicionou nenhum livro.</p>';
        return;
    }
    
    document.querySelector('.section-title').textContent = 'Meus Livros';
    
    myBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        let statusClass = '';
        let statusText = '';
        
        switch (book.status) {
            case 'available':
                statusClass = 'status-available';
                statusText = 'Disponível';
                break;
            case 'borrowed':
                statusClass = 'status-borrowed';
                statusText = `Emprestado para ${book.borrower}`;
                break;
            case 'unavailable':
                statusClass = 'status-unavailable';
                statusText = 'Indisponível';
                break;
        }
        
        bookCard.innerHTML = `
            <div class="book-cover">${book.title[0].toUpperCase()}</div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-status ${statusClass}">
                    <span>${statusText}</span>
                </p>
                <div class="action-buttons">
                    <button class="btn btn-primary view-book" data-id="${book.id}">Ver Detalhes</button>
                    ${book.status === 'borrowed' ? 
                        `<button class="btn btn-light return-book" data-id="${book.id}">Marcar como Devolvido</button>` : ''}
                </div>
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });
    
    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.view-book').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            viewBookDetails(bookId);
        });
    });
    
    document.querySelectorAll('.return-book').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            returnBook(bookId);
        });
    });
}

// Carregar meus empréstimos
// function loadMyBorrows() {
//     if (!currentUser) return;
    
//     booksGrid.innerHTML = '';
    
//     const myBorrows = books.filter(book => book.borrower === currentUser.email);
    
//     if (myBorrows.length === 0) {
//         booksGrid.innerHTML = '<p>Você não tem livros emprestados no momento.</p>';
//         return;
//     }
    
//     document.querySelector('.section-title').textContent = 'Meus Empréstimos';
    
//     myBorrows.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.className = 'book-card';
        
//         bookCard.innerHTML = `
//             <div class="book-cover">${book.title[0].toUpperCase()}</div>
//             <div class="book-info">
//                 <h3 class="book-title">${book.title}</h3>
//                 <p class="book-author">${book.author}</p>
//                 <p class="book-status status-borrowed">
//                     <span>Emprestado de ${book.owner}</span>
//                 </p>
//                 <div class="action-buttons">
//                     <button class="btn btn-primary view-book" data-id="${book.id}">Ver Detalhes</button>
//                     <button class="btn btn-light return-book" data-id="${book.id}">Marcar como Devolvido</button>
//                 </div>
//             </div>
//         `;
        
//         booksGrid.appendChild(bookCard);
//     });
    
//     // Adicionar eventos aos botões de ação
//     document.querySelectorAll('.view-book').forEach(button => {
//         button.addEventListener('click', function() {
//             const bookId = parseInt(this.getAttribute('data-id'));
//             viewBookDetails(bookId);
//         });
//     });
    
//     document.querySelectorAll('.return-book').forEach(button => {
//         button.addEventListener('click', function() {
//             const bookId = parseInt(this.getAttribute('data-id'));
//             returnBook(bookId);
//         });
//     });
// }

// Visualizar detalhes do livro
function viewBookDetails(bookId) {
    const book = BOOKSGLOBAL.find(b => b.id === bookId);
    if (!book) return;
    
    alert(`Título: ${book.title}\nAutor: ${book.author}\nCategoria: ${book.category}\nDescrição: ${book.description}\nStatus: ${book.status}\nProprietário: ${book.owner}\nEmprestado para: ${book.borrower || 'Ninguém'}`);
}

// Solicitar empréstimo de livro
// function borrowBook(bookId) {
//     if (!currentUser) {
//         alert('Por favor, faça login para solicitar um livro.');
//         return;
//     }
    
//     const book = books.find(b => b.id === bookId);
//     if (!book) return;
    
//     if (book.owner === currentUser.email) {
//         alert('Você é o proprietário deste livro!');
//         return;
//     }
    
//     if (confirm(`Deseja solicitar o livro "${book.title}"?`)) {
//         book.status = 'borrowed';
//         book.borrower = currentUser.email;
//         loadBooks();
//         alert('Livro solicitado com sucesso!');
//     }
// }

// Devolver livro
// function returnBook(bookId) {
//     const book = books.find(b => b.id === bookId);
//     if (!book) return;
    
//     if (confirm(`Deseja marcar o livro "${book.title}" como devolvido?`)) {
//         book.status = 'available';
//         book.borrower = null;
        
//         if (document.querySelector('.section-title').textContent === 'Meus Empréstimos') {
//             loadMyBorrows();
//         } else {
//             loadMyBooks();
//         }
        
//         alert('Livro marcado como devolvido com sucesso!');
//     }
// }

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', init);