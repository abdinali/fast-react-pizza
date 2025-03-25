import { useState } from 'react';
import { Form, redirect, useNavigation, useActionData } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import { getCart, getTotalCartPrice } from '../cart/cartSlice';
import LinkButton from '../../ui/LinkButton';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { clearCart } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str,
    );

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false);

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const formErrors = useActionData();

    const username = useSelector((state) => state.user.username);

    const cart = useSelector(getCart);

    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;
    if (cart.length === 0) return <EmptyCart />;

    return (
        <div className="px-3 py-3">
            <LinkButton to="/cart">&larr; Back to cart</LinkButton>

            <h2 className="mb-8 mt-7 text-xl font-semibold">
                Ready to order? Let&apos;s go!
            </h2>

            <Form method="POST">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input
                        type="text"
                        name="customer"
                        required
                        className="input grow"
                        defaultValue={username}
                    />
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="input w-full"
                        />
                        {formErrors?.phone && (
                            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs font-bold text-red-700">
                                {formErrors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            type="text"
                            name="address"
                            required
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to give your order priority?
                    </label>
                </div>

                <div>
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <Button disabled={isSubmitting} type="primary">
                        {isSubmitting
                            ? 'Placing order...'
                            : `Order now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'true',
    };

    const errors = {};
    if (!isValidPhone(order.phone))
        errors.phone =
            'Please give us your correct phone number. We might need to contact you.';

    // return without creating new order if errors are found
    if (Object.keys(errors).length > 0) return errors;

    // create new order and redirect
    const newOrder = await createOrder(order);

    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
