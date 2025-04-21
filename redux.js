const Redux = {
    createStore(reducer, initialState) {
        let currentState = initialState;
        let listeners = [];

        const savedState = localStorage.getItem("redux-books-state");
        if (savedState) {
            currentState = JSON.parse(savedState);

            if (currentState.books && currentState.books.length > 0) {
                window.uniqId = Math.max(
                    ...currentState.books.map((book) => {
                        return book.id;
                    })
                );
            }

            currentState = reducer(currentState, {
                type: "@@redux/INITk.p.e.c.s.i",
            });

            return {
                getState() {
                    return currentState;
                },
                dispatch(action) {
                    currentState = reducer(currentState, action);
                    localStorage.setItem(
                        "redux-books-state",
                        JSON.stringify(currentState)
                    );
                    listeners.forEach((listener) => {
                        return listener();
                    });
                },

                subscribe(listener) {
                    if (typeof listener === "function") {
                        return listeners.push(listener);
                    }
                },
            };
        }
    },
};

export default Redux;
