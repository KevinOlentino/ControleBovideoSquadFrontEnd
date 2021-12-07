function appViewModel() {
    const self = this
    const apiUrl = 'https://localhost:7168/api/animal'

    self.animais = ko.observableArray()
    self.especies = ko.observableArray()
    self.propriedades = ko.observableArray()
    self.tiposDeEntrada = ko.observableArray()

    self.quantidadeTotal = ko.observable("1").extend({
        required: true,
        min: 1,
    })
    self.quantidadeVacinada = ko.observable("0").extend({
        required: true,
        min: 0,
        validation: {
            message: 'O saldo vacinado não pode ser maior que o saldo total',
            validator: value => value <= self.quantidadeTotal()
        }
    })
    self.selectedEspecie = ko.observable("0").extend({
        required: true,
    })
    self.selectedPropriedade = ko.observable("1").extend({
        required: true,
    })
    self.selectedTipoEntrada = ko.observable("1").extend({
        required: true,
    })

    $.get(apiUrl, self.animais)
    $.get('https://localhost:7168/api/especie', self.especies)
    $.get('https://localhost:7168/api/propriedade', self.propriedades)
    $.get('https://localhost:7168/api/tipodeentrada', data => self.tiposDeEntrada(Array.from(data).filter(data => data.nome != 'Compra')))

    self.salvarEntrada = () => {
        let errors = ko.validation.group(this)
        if (errors().length > 0) return errors.showAllMessages()

        const animalDto = {
            quantidadeTotal: Number(self.quantidadeTotal()),
            quantidadeVacinada: Number(self.quantidadeVacinada()),
            idEspecie: Number(self.selectedEspecie()),
            idPropriedade: Number(self.selectedPropriedade()),
            idTipoDeEntrada: Number(self.selectedTipoEntrada()),
            dataDeEntrada: new Date()
        }

        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(animalDto),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: data => console.log(data),
            error: error => console.log(error.responseText)
        }).then(() => {
            $.get(apiUrl, self.animais)
            $('#adicionarAnimal').modal('hide')
        })
    }

    self.cancelarEntrada = (animal) => {
        $.ajax({
            url: `${apiUrl}/${animal.idAnimal}`,
            type: 'DELETE',
            success: data => console.log(data),
            error: error => console.log(error)
        }).then(() => {
            $.get(apiUrl, self.animais)
            alert('Entrada de animal cancelada')
        }).catch(alert)
    }
}

ko.applyBindings(new appViewModel())