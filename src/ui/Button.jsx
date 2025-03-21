import { Link } from 'react-router-dom';

function Button({ children, disabled, to, type }) {
    const base =
        'text-sm inline-block rounded-full bg-yellow-400 font-semibold uppercase tracking-widest text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed';
    const styles = {
        primary: base + ' px-4 py-3 md:px-6 md:py-4',
        small: base + ' py-2 px-4 text-xs sm:text-sm sm:px-5 sm:py-2.5',
        secondary:
            'text-sm inline-block rounded-full border-2 border-stone-300 bg-transparent px-4 py-2.5 font-semibold uppercase tracking-widest text-stone-400 ring-stone-200 transition-colors duration-300 hover:bg-stone-300 hover:text-stone-800 focus:bg-stone-200 focus:text-stone-800 focus:outline-none focus:ring focus:ring-offset-2 disabled:cursor-not-allowed md:px-6 md:py-3.5',
    };
    if (to) {
        return (
            <Link className={styles[type]} to={to}>
                {children}
            </Link>
        );
    }

    return (
        <button className={styles[type]} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;
