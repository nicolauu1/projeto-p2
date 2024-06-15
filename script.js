const enderecosSalvos = [];

function consultarEndere() {
    const cep = document.querySelector('#cep').value.trim();
    
    if (cep.length !== 9) {
        alert("CEP inválido!");
        return;
    }

    fetchEndereco(cep).then(dados => {
        mostrarEnd(dados);
    });
}

function fetchEndereco(cep) {
    const url = `https://cdn.apicep.com/file/apicep/${cep}.json`;
    return fetch(url).then(response => response.json());
}

function mostrarEnd(dados) {
    const resultado = document.querySelector("#resultado");

    if (dados.erro) {
        resultado.innerHTML = "Não foi possível encontrar esse CEP";
    } else {
        resultado.innerHTML = `<b><p>RESULTADO ⬇️ :</p></b> 
            <p>${dados.address}, ${dados.city} - ${dados.state}, CEP: ${dados.code}</p>`;
        salvarEndereco(dados);
    }
}

function salvarEndereco(dados) {
    const index = enderecosSalvos.findIndex(endereco => endereco.code === dados.code);
    if (index === -1) {
        enderecosSalvos.push(dados);
    } else {
        enderecosSalvos[index] = dados;
    }
    atualizarListaEnderecos();
}

function atualizarListaEnderecos() {
    const lista = document.getElementById('enderecos-lista');
    lista.innerHTML = '';

    enderecosSalvos.forEach((endereco, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${endereco.address}, ${endereco.city} - ${endereco.state}, CEP: ${endereco.code}`;
        listItem.id = `endereco-${index}`;
        lista.appendChild(listItem);
    });
}

function atualizarEndereco() {
    const cep = document.getElementById('update-cep').value.trim();

    fetchEndereco(cep).then(dados => {
        if (dados.erro) {
            alert("CEP inválido!");
        } else {
            const index = enderecosSalvos.findIndex(endereco => endereco.code === cep);
            if (index > -1) {
                enderecosSalvos[index] = dados;
                atualizarListaEnderecos();
            } else {
                alert("Endereço não foi encontrado para ser atualizado");
            }
        }
    });
}

function deletarEndereco() {
    const cep = document.getElementById('delete-cep').value.trim();
    const index = enderecosSalvos.findIndex(endereco => endereco.code === cep);

    if (index > -1) {
        enderecosSalvos.splice(index, 1);
        atualizarListaEnderecos();
    } else {
        alert("O Endereço não foi encontrado para ser deletado.");
    }
}
