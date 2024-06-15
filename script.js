const end = [];

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('#pesquisar').addEventListener('click', pesquisarEnd);
    document.querySelector('.btn-update').addEventListener('click', atualizarDados);
    document.querySelector('.btn-delete').addEventListener('click', deletarDados);
});

function pesquisarEnd() {
    const cep = document.querySelector('#cep').value.trim();
    
    if (cep.length !== 9) {
        alert("Formato para CEP invalido.");
        return;
    }

    fetchEndereco(cep).then(dados => {
        mostrarEnd(dados);
    });
}

function fetchEndereco(cep) {
    const url = `https://brasilapi.com.br/api/cep/v2/${cep}.json`;
    return fetch(url).then(response => response.json());
}

function mostrarEnd(dados) {
    const resultado = document.querySelector("#resultado");

    if (dados.erro) {
        resultado.innerHTML = "Não foi possível encontrar esse CEP";
    } else {
        resultado.innerHTML = `<b><p>RESULTADO ⬇️ :</p></b> 
            <p>${dados.street}, ${dados.neighborhood}, ${dados.city} - ${dados.state}, CEP: ${dados.cep}</p>`;
        salvarEndereco(dados);
    }
}

function salvarEndereco(dados) {
    const index = end.findIndex(endereco => endereco.cep === dados.cep);
    if (index === -1) {
        end.push(dados);
    } else {
        end[index] = dados;
    }
    atualizarListaEnderecos();
}

function atualizarListaEnderecos() {
    const lista = document.getElementById('lista-salva');
    lista.innerHTML = '';

    end.forEach((endereco, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${endereco.street}, ${endereco.neighborhood}, ${endereco.city} - ${endereco.state}, CEP: ${endereco.cep}`;
        listItem.id = `endereco-${index}`;
        lista.appendChild(listItem);
    });
}

function atualizarDados() {
    const cep = document.getElementById('update-cep').value.trim();

    fetchEndereco(cep).then(dados => {
        if (dados.erro) {
            alert("CEP inválido!");
        } else {
            const index = end.findIndex(endereco => endereco.cep === cep);
            if (index > -1) {
                end[index] = dados;
                atualizarListaEnderecos();
            } else {
                alert("Endereço não foi encontrado para ser atualizado");
            }
        }
    });
}

function deletarDados() {
    const cep = document.getElementById('delete-cep').value.trim();
    const index = end.findIndex(endereco => endereco.cep === cep);

    if (index > -1) {
        end.splice(index, 1);
        atualizarListaEnderecos();
    } else {
        alert("O Endereço não foi encontrado para ser deletado.");
    }
}
