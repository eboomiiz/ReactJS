import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ImagePage from './pages/Album/ImagePage';
import EditAlbumPage from './pages/Album/EditPage'
import CreateAlbumPage from './pages/Album/CreatePage'

import { ToastProvider } from 'react-toast-notifications';
import AddPhotoPage from "./pages/Album/AddPhotoPage";
import PrivateRoute from "./guard/auth";

//redux setup
import { Provider } from 'react-redux'

// setup thunk แบบไม่ใช้ redux persist
import { createStore, applyMiddleware } from 'redux'; //ของเดิม ที่ไม่ได้ใช้ persist
import rootReducer from './redux/reducers/index' //ของเดิม ที่ไม่ได้ใช้ persist
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
    <ToastProvider
    placement="top-center"
    autoDismiss
    autoDismissTimeout={3000}
    >
    <QueryClientProvider client={queryClient}>
    <Router>
      <NavBar/>
      <Switch>

        <Route exact path="/">
          <HomePage/>
        </Route>
        <Route path="/register">
          <RegisterPage/>
        </Route>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/image/:id/:title">
          <ImagePage/>
        </Route>
        <PrivateRoute path="/create">
          <CreateAlbumPage/>
        </PrivateRoute>
        <PrivateRoute path="/edit/:id/:title">
          <EditAlbumPage/>
        </PrivateRoute>
        <PrivateRoute path="/addphoto/:id/:title">
          <AddPhotoPage/>
        </PrivateRoute>

      </Switch>
      <Footer title='© Boom 2021-'/>
    </Router>
    </QueryClientProvider>
    </ToastProvider>
    </Provider>
  );
}

export default App;
