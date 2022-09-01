import {Link} from 'react-router-dom';

import {useAuthContext} from '../../store/auth-context';
import './MainNavigation.css';

const MainNavigation = () => {
    const authCtx = useAuthContext();

    const isLoggedIn = authCtx.isLoggedIn;

    const logoutHandler = () => {
        authCtx.logout();

    };

    return (
        <header className={"header"}>
            <Link to='/'>
                <div className={"logo"}>React Auth</div>
            </Link>
            <nav>
                <ul>
                    {!isLoggedIn && (
                        <li>
                            <Link to='/auth'>Login</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <Link to='/profile'>Profile</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
