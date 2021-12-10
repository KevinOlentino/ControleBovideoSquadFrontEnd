function formatarData(data){
    var data = new Date(data),
    dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

function appViewModel() {
    const self = this
    const apiUrl = 'https://localhost:7168/api/venda'

    self.quantidade = ko.observable("1").extend({
        required: true,
        min: 1
    })
    self.origemSelecionada = ko.observable("1").extend({
        required: true
    })
    self.destinoSelecionado = ko.observable("1").extend({
        required: true
    })
    self.finalidadeDeVendaSelecionada = ko.observable("1").extend({
        required: true
    })
    self.especieSelecionada = ko.observable("1").extend({
        required: true
    })

    self.vendas = ko.observableArray()
    self.propriedades = ko.observableArray()
    self.propriedadesSemAOrigem = ko.observableArray()
    self.finalidadesDeVenda = ko.observableArray()
    self.especies = ko.observableArray()

    $.get(apiUrl, self.vendas)
    $.get('https://localhost:7168/api/propriedade', self.propriedades)
    $.get('https://localhost:7168/api/finalidadedevenda', self.finalidadesDeVenda)
    $.get('https://localhost:7168/api/especie', self.especies)

    self.origemSelecionada.subscribe(origem => {
        const arrayFiltrado = Array.from(self.propriedades()).filter(propriedade => propriedade.idPropriedade != origem)
        self.propriedadesSemAOrigem(arrayFiltrado)
    })

    self.salvarVenda = () => {
        let errors = ko.validation.group(this)
        if (errors().length > 0) return errors.showAllMessages()

        const vendaDto = {
            quantidade: Number(self.quantidade()),
            idPropriedadeOrigem: Number(self.origemSelecionada()),
            idPropriedadeDestino: Number(self.destinoSelecionado()),
            idFinalidadeDeVenda: Number(self.finalidadeDeVendaSelecionada()),
            idEspecie: Number(self.especieSelecionada()),
            dataDeVenda: new Date()
        }

        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(vendaDto),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: console.log,
            error: error => MostrarMensagem(error.responseJSON[0])
        }).then(() => {
            $.get(apiUrl, self.vendas)
            $('#adicionarVenda').modal('hide')
            MostrarSucesso("Venda adicionada!")
        }).catch(console.log)
    }

    self.cancelarVenda = (venda) => {
        $.ajax({
            url: `${apiUrl}/${venda.idVenda}`,
            type: 'DELETE',
            success: console.log,
            error: console.log
        }).then(() => {
            $.get(apiUrl, self.vendas)
            MostrarSucesso("Registro de venda cancelado!")
        }).catch(MostrarErro)
    }
}

ko.applyBindings(new appViewModel())