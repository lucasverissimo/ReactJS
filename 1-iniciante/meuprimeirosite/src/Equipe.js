import React, { Component } from 'react';

export default class Equipe extends Component {

    render(){
        return (
            <Sobre nome={this.props.nome} cargo={this.props.cargo} idade={this.props.idade} />
        );
    }

}

class Sobre extends Component{
    render(){
        return(
            <div>
                Nome: { this.props.nome }<br/>
                Cargo: { this.props.cargo}<br/>
                Idade: { this.props.idade }
                <hr />
            </div>
        );
    }
}