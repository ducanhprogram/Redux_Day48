import { store, addBook, updateBook, removeBook, setFilter } from "./store.js";

const bookInput = document.querySelector("#book-input");
const addBookBtn = document.querySelector("#add-book-btn");
const bookList = document.querySelector("#book-list");
const filterInput = document.querySelector("#filter-input");
const resultCount = document.querySelector("#result-count");

let edittingBookId = null;
let edittingBookValue = "";

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function showNotification(message, type = "success") {
    const backgroundColor =
        {
            success: "#28a745",
            error: "#dc3545",
        }[type] || "#28a745";

    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: backgroundColor,
        },
        stopOnFocus: true,
    }).showToast();
}

function renderBooks() {
    const state = store.getState();
    console.log(state);
    const books = state.books.filter((book) => {
        return book.name.toLowerCase().includes(state.filter.toLowerCase());
    });
    bookList.innerHTML = "";

    books.forEach((book) => {
        const li = document.createElement("li");

        // Kiểm tra xem sách này có đang được chỉnh sửa không
        if (book.id === edittingBookId) {
            const input = document.createElement("input");
            input.type = "text";
            input.value = edittingBookValue;
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    const saveBtn = li.querySelector(".save-btn");
                    saveBtn.click();
                }
            });

            li.appendChild(input);

            const saveBtn = document.createElement("button");
            saveBtn.className = "save-btn";
            saveBtn.textContent = "Lưu";
            saveBtn.addEventListener("click", () => {
                const newName = input.value.trim();
                if (newName) {
                    store.dispatch(updateBook(book.id, newName));
                    showNotification(
                        `Cập nhật sách thành công: ${newName}`,
                        "success"
                    );
                } else {
                    showNotification("Tên sách không được để trống!!", "error");
                }
                edittingBookId = null;
                edittingBookValue = "";
                renderBooks();
            });
            li.appendChild(saveBtn);
            input.focus();

            const cancelBtn = document.createElement("button");
            cancelBtn.className = "cancel-btn";
            cancelBtn.textContent = "Hủy";
            cancelBtn.addEventListener("click", () => {
                edittingBookId = null;
                edittingBookValue = "";
                renderBooks();
            });
            li.appendChild(cancelBtn);

            input.focus();
        } else {
            const nameSpan = document.createElement("span");
            nameSpan.className = "book-name";
            nameSpan.textContent = book.name;
            li.appendChild(nameSpan);

            const editBtn = document.createElement("button");
            editBtn.className = "edit-btn";
            editBtn.textContent = "Sửa";
            editBtn.addEventListener("click", () => {
                edittingBookId = book.id;
                edittingBookValue = book.name;
                renderBooks();
            });
            li.appendChild(editBtn);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Xóa";
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = window.confirm(
                `Bạn có chắc chắn muốn xóa sách: "${book.name}"? `
            );
            if (confirmDelete) {
                if (book.id === edittingBookId) {
                    edittingBookId = null;
                    edittingBookValue;
                }
                store.dispatch(removeBook(book.id));
                showNotification(`Xóa sách thành công: ${book.name}`, "error");
            }
        });
        li.appendChild(deleteBtn);
        bookList.appendChild(li);
    });
    resultCount.textContent = `Tổng số sách: ${books.length} `;
}

store.subscribe(renderBooks);

addBookBtn.addEventListener("click", () => {
    const name = bookInput.value.trim();
    if (name) {
        store.dispatch(addBook(name));
        showNotification(`Thêm sách thành công: ${name}`, "success");
        bookInput.value = "";
    } else {
        showNotification("Vui lòng nhập tên sách! ", "error");
    }
});

bookInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addBookBtn.click();
    }
});

const debouncedSearch = debounce(() => {
    store.dispatch(setFilter(filterInput.value));
}, 800);

filterInput.addEventListener("input", debouncedSearch);

renderBooks();
