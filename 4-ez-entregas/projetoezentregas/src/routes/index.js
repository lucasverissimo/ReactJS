import { Switch } from "react-router-dom";

import Route from "./Route";

import Login from "../pages/Login";

import Dashboard from '../pages/Dashboard';
import Usuarios from "../pages/Usuarios";
import FormUsuarios from '../pages/FormUsuarios';
import NotFound from "../pages/NotFound";
import Categorias from "../pages/Categorias";
import FormCategorias from "../pages/FormCategorias";

export default function Routes(){
   return(
        <Switch>
            <Route exact path="/" component={Login} />    
            <Route exact path="/dashboard" component={Dashboard} isPrivate  />
            <Route exact path="/usuarios" component={Usuarios} isPrivate />
            <Route exact path="/form-usuarios" component={FormUsuarios} isPrivate />
            <Route exact path="/form-usuarios/:id" component={FormUsuarios} isPrivate />
            <Route exact path="/categorias" component={Categorias} isPrivate />
            <Route exact path="/form-categorias" component={FormCategorias} isPrivate />
            <Route exact path="/form-categorias/:id" component={FormCategorias} isPrivate />
            
            <Route component={NotFound} isPrivate />
        </Switch>
    );
}