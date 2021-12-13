function appViewModel() {
    const self = this
    const apiUrl = 'https://localhost:7168/api/animal'

    self.quantidadeTotal = ko.observable("1").extend({
        required: true,
        min: 1,
    })
    self.quantidadeVacinada = ko.observable("0").extend({
        required: true,
        min: 0,
        validation: {
            message: 'O saldo vacinado não pode ser maior que o saldo total',
            validator: value => Number(value) <= Number(self.quantidadeTotal())
        }
    })
    self.especieSelecionada = ko.observable("1").extend({
        required: true,
    })
    self.propriedadeSelecionada = ko.observable("1").extend({
        required: true,
    })
    self.tipoDeEntradaSelecionada = ko.observable("1").extend({
        required: true,
    })

    self.animais = ko.observableArray()
    self.especies = ko.observableArray()
    self.propriedades = ko.observableArray()
    self.tiposDeEntrada = ko.observableArray()

    $.get(apiUrl, self.animais)
    $.get('https://localhost:7168/api/especie', self.especies)
    $.get('https://localhost:7168/api/propriedade', self.propriedades)
    $.get('https://localhost:7168/api/tipodeentrada', data => self.tiposDeEntrada(data.filter(data => data.nome != 'Compra')))


    self.salvarEntrada = () => {
        console.log(self.quantidadeTotal())
        console.log(self.quantidadeVacinada())
        let errors = ko.validation.group(this)
        if (errors().length > 0) return errors.showAllMessages()

        const animalDto = {
            quantidadeTotal: Number(self.quantidadeTotal()),
            quantidadeVacinada: Number(self.quantidadeVacinada()),
            idEspecie: Number(self.especieSelecionada()),
            idPropriedade: Number(self.propriedadeSelecionada()),
            idTipoDeEntrada: Number(self.tipoDeEntradaSelecionada()),
            dataDeEntrada: new Date()
        }

        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(animalDto),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: console.log,
            error: console.log
        }).then(() => {
            $.get(apiUrl, self.animais)
            MostrarSucesso("Entrada animal inserida")
            $('#adicionarAnimal').modal('hide')
        }).catch(MostrarErro)
    }

    self.cancelarEntrada = (animal) => {
        $.ajax({
            url: `${apiUrl}/${animal.idAnimal}`,
            type: 'DELETE',
            success: console.log,
            error: console.log
        }).then(() => {
            $.get(apiUrl, self.animais)
            MostrarSucesso("Entrada cancelada")
        }).catch(console.log)
    }
}

ko.applyBindings(new appViewModel())