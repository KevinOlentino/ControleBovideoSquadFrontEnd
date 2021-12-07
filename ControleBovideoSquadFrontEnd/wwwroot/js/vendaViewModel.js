function formatarData(data){
    var data = new Date(data),
    dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

function mostrarNotficacao(msg, erro = false) {
    const toast = document.getElementById('toast')
    toast.innerHTML = msg
    toast.style.opacity = 1
    setTimeout(() => toast.style.opacity = 0, 2000)
}

function appViewModel() {
    const self = this
    const apiUrl = 'https://localhost:7168/api/venda'

    self.quantidade = ko.observable("1").extend({
        required: true,
        min: 1
    })
    self.selectedPropriedadeOrigem = ko.observable("1").extend({
        required: true
    })
    self.selectedPropriedadeDestino = ko.observable("1").extend({
        required: true
    })
    self.selectedFinalidadeVenda = ko.observable("1").extend({
        required: true
    })
    self.selectedEspecie = ko.observable("1").extend({
        required: true
    })

    self.vendas = ko.observableArray()
    self.propriedades = ko.observableArray()
    self.finalidadesDeVenda = ko.observableArray()
    self.especies = ko.observableArray()

    $.get(apiUrl, self.vendas)
    $.get('https://localhost:7168/api/propriedade', self.propriedades)
    $.get('https://localhost:7168/api/finalidadedevenda', self.finalidadesDeVenda)
    $.get('https://localhost:7168/api/especie', self.especies)

    self.salvarVenda = () => {
        let errors = ko.validation.group(this)
        if (errors().length > 0) return errors.showAllMessages()
        const vendaDto = {
            quantidade: Number(self.quantidade()),
            idPropriedadeOrigem: Number(self.selectedPropriedadeOrigem()),
            idPropriedadeDestino: Number(self.selectedPropriedadeDestino()),
            idFinalidadeDeVenda: Number(self.selectedFinalidadeVenda()),
            idEspecie: Number(self.selectedEspecie()),
            dataDeVenda: new Date()
        }

        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(vendaDto),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: data => mostrarNotficacao(data),
            error: error => mostrarNotficacao(error.responseJSON[0])
        }).then(() => {
            $.get(apiUrl, self.vendas)
            $('#adicionarVenda').modal('hide')
        })
    }

    self.cancelarVenda = (venda) => {
        $.ajax({
            url: `${apiUrl}/${venda.idVenda}`,
            type: 'DELETE',
            success: data => console.log(data),
            error: error => alert(error.responseText)
        }).then(() => {
            $.get(apiUrl, self.vendas)
            alert('Registro de venda cancelado')
        }).catch(alert)
    }
}

ko.applyBindings(new appViewModel())