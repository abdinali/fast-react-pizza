import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            // payload = newItem
            state.cart.push(action.payload);
        },
        deleteItem(state, action) {
            // payload = pizzaId
            state.cart = state.cart.filter(
                (item) => item.pizzaId !== action.payload,
            );
        },
        increaseItemQuantity(state, action) {
            // payload = pizzaId
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseItemQuantity(state, action) {
            // payload = pizzaId
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;

            if (item.quantity === 0)
                cartSlice.caseReducers.deleteItem(state, action);
        },
        clearCart(state, action) {
            state.cart = [];
        },
    },
});

const getTotalCartQuantity = (state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

const getTotalCartPrice = (state) =>
    state.cart.cart.reduce((price, item) => price + item.totalPrice, 0);

const getCart = (state) => state.cart.cart;

const getCurrentQuantityById = (id) => (state) =>
    state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;

const {
    reducer,
    actions: {
        addItem,
        deleteItem,
        increaseItemQuantity,
        decreaseItemQuantity,
        clearCart,
    },
} = cartSlice;

export {
    reducer as default,
    addItem,
    deleteItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
    getTotalCartQuantity,
    getTotalCartPrice,
    getCart,
    getCurrentQuantityById,
};
