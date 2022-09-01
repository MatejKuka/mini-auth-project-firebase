import {Switch, Route, Redirect} from 'react-router-dom';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import {useAuthContext} from './store/auth-context';
import ProfilePage from "./pages/ProfilePage";

function App() {
    const authCtx = useAuthContext();

    return (
        <Layout>
            <Switch>
                <Route path='/' exact>
                    <HomePage/>
                </Route>
                {!authCtx.isLoggedIn && (
                    <Route path='/auth'>
                        <AuthPage/>
                    </Route>
                )}
                <Route path='/profile'>
                    {authCtx.isLoggedIn && <ProfilePage/>}
                    {!authCtx.isLoggedIn && <Redirect to='/auth'/>}
                </Route>
                <Route path='*'>
                    <Redirect to='/'/>
                </Route>
            </Switch>
        </Layout>
    );
}

export default App;
