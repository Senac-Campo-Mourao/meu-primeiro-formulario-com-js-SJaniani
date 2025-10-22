$('#clientCPF').mask('000.000.000-00');
$('#clientTelefone').mask('(00) 00000-0000');

$('#clientSalario').maskMoney({
    prefix: 'R$ ',
    allowNegative: false, thousands: '.', decimal: ',', affixesStay: false
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[.-]/g, ""); // Remove pontos e traços
    if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

document.getElementById("clientCPF").addEventListener("blur", function () {
    const cpf = this.value;
    if (!validarCPF(cpf)) {
        alert("CPF inválido. Por favor, insira um CPF válido.");
    }
});

document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCPF').value;
    const telefone = document.getElementById('clientTelefone').value;
    const dtNascimento = document.getElementById('clientDtNascimento').value;
    const salario = document.getElementById('clientSalario').value;
    console.log(salario);
    const salarioConvertido = converterEmCentavos(salario);
    console.log(salarioConvertido);
    const credito = salarioConvertido * 0.3;
    const creditoEmReal = converterEmReal(credito);
   
    const cliente = {name, cpf, telefone, dtNascimento, salario, creditoEmReal

    };
        

    salvarCliente(cliente);
    limparFormulario();
    alert('Cliente cadastrado com sucesso!');   
});

function obterTotalClientes() {
        return parseInt(localStorage.getItem('totalCliente') || '0', 10);
}

function salvarCliente(cliente){

    const index = obterTotalClientes();
    
    localStorage.setItem(`cliente_${index}_name`, cliente.name);
    localStorage.setItem(`cliente_${index}_cpf`, cliente.cpf);
    localStorage.setItem(`cliente_${index}_telefone`, cliente.telefone);
    localStorage.setItem(`cliente_${index}_dtNascimento`, cliente.dtNascimento);
    localStorage.setItem(`cliente_${index}_salario`, cliente.salario);
    localStorage.setItem(`cliente_${index}_creditoDisponivel`, cliente.creditoEmReal);

    localStorage.setItem('totalCliente', index + 1); // função para atualizar o valor do index

    carregarClientes();

}
function limparFormulario() {
    const clientes = []; // buscar todos os clientes cadastrados
    const tbody = document.getElementById('listaClientes');

    tbody.innerHTML = ''; // zerar o conteúdo da tabela para preencher novamente
    clientes.forEach(cli => { 
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cli.name}</td>
            <td>${cli.cpf}</td>
            <td>${cli.telefone}</td>
            <td>${cli.dtNascimento}</td>
            <td>R$ ${cli.salario}</td>
            <td>R$ ${cli.creditoDisponivel}</td>
        `;
        tbody.appendChild(tr);

    });


}




function carregarClientes(){
    const totalClientes = obterTotalClientes();
    const clientes = [];       

    for(let i = 0; i < totalClientes; i++){
        const cliente = {
            name: localStorage.getItem(`cliente_${i}_name`),
            cpf: localStorage.getItem(`cliente_${i}_cpf`),
            telefone: localStorage.getItem(`cliente_${i}_telefone`),
            dtNascimento: localStorage.getItem(`cliente_${i}_dtNascimento`),
            salario: localStorage.getItem(`cliente_${i}_salario`),
            creditoDisponivel: localStorage.getItem(`cliente_${i}_creditoDisponivel`)
        };
        clientes.push(cliente);
    }

    return clientes;
}

    
function converterEmCentavos(salario) {
    const salarioEmCentavos = salario.replace(/[^\d,]/g, '').replace(',', '.');
    const salarioEmNumero = parseFloat(salarioEmCentavos);

    return Math.round(salarioEmNumero * 100);
}

function converterEmReal(credito) {
    const creditoConvertido = (credito / 100).toFixed(2);
    return creditoConvertido.replace('.', ',')
        .replace(/\d(?=(\d{3})+,)/g, '$&');

}
