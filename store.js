import Redux from "./Redux.js";

export const ADD_BOOK = "ADD_BOOK";
export const UPDATE_BOOK = "UPDATE_BOOK";
export const REMOVE_BOOK = "REMOVE_BOOK";
export const SET_FILTER = "SET_FILTER";

window.uniqId = window.uniqId || 0;

export const createAction = (type, payload) => {
    return { type, payload };
};

export const addBook = (name) => {
    return createAction(ADD_BOOK, { id: ++window.uniqId, name });
};

export const updateBook = (id, name) => {
    return createAction(UPDATE_BOOK, { id, name });
};

export const removeBook = (id) => {
    return createAction(REMOVE_BOOK, id);
};

export const setFilter = (filter) => {
    return createAction(SET_FILTER, filter);
};

// Init state
export const initState = {
    books: [],
    filter: "",
};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case ADD_BOOK:
            return {
                ...state,
                books: [...state.books, action.payload],
            };
        case UPDATE_BOOK:
            return {
                ...state,
                books: state.books.map((book) => {
                    return book.id === action.payload.id
                        ? { ...book, name: action.payload.name }
                        : book;
                }),
            };

        case REMOVE_BOOK:
            return {
                ...state,
                books: state.books.filter((book) => {
                    return book.id !== action.payload;
                }),
            };
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload,
            };
        default:
            return state;
    }
};

export const store = Redux.createStore(reducer, initState);
