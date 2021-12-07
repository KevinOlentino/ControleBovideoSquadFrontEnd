function appViewModel() {
    const self = this
    const apiUrl = 'https://localhost:7168/api/animal'

    self.animais = ko.observableArray()
    self.especies = ko.observableArray()
    self.propriedades = ko.observableArray()
    self.tiposDeEntrada = ko.observableArray()

    self.quantidadeTotal = ko.observable("0").extend({
        required: true,
        min: 1,
    })
    self.quantidadeVacinada = ko.observable("0").extend({
        required: true,
        min: 0,
    })
    self.selectedEspecie = ko.observable("").extend({
        required: true,
    })
    self.selectedPropriedade = ko.observable("").extend({
        required: true,
    })
    self.selectedTipoEntrada = ko.observable("").extend({
        required: true,
    })

    self.quantidadeTotalInvalida = ko.observable()
    self.quantidadeVacinadaInvalida = ko.observable()
    self.selectedEspecieInvalida = ko.observable()
    self.selectedPropriedadeInvalida = ko.observable()
    self.selectedTipoEntradaInvalido = ko.observable()

    $.get(apiUrl, self.animais)
    $.get('https://localhost:7168/api/especie', self.especies)
    $.get('https://localhost:7168/api/propriedade', self.propriedades)
    $.get('https://localhost:7168/api/tipodeentrada', data => self.tiposDeEntrada(Array.from(data).filter(data => data.nome != 'Compra')))

    function validarCampos() {
        let valido = true
        if (!self.quantidadeTotal() || self.quantidadeTotal() == 0) {
            self.quantidadeTotalInvalida('A quantidade total não pode ser zero')
            valido = false
            setTimeout(() => self.quantidadeTotalInvalida(''), 2300)
        }
        if (!self.selectedEspecie()) {
            self.selectedEspecieInvalida('Campo obrigatório')
            valido = false
            setTimeout(() => self.selectedEspecieInvalida(''), 2300)
        }
        if (!self.selectedPropriedade()) {
            self.selectedPropriedadeInvalida('Campo obrigatório')
            valido = false
            setTimeout(() => self.selectedPropriedadeInvalida(''), 2300)
        }
        if (!self.selectedTipoEntrada()) {
            self.selectedTipoEntradaInvalido('Campo obrigatório')
            valido = false
            setTimeout(() => self.selectedTipoEntradaInvalido(''), 2300)
        }
        return valido
    }

    self.salvarEntrada = () => {
        let errors = ko.validation.group(this)
        if (errors.length > 0) return errors.showAllMessages()

        const animalDto = {
            quantidadeTotal: Number(self.quantidadeTotal()),
            quantidadeVacinada: Number(self.quantidadeVacinada()),
            idEspecie: Number(self.selectedEspecie()),
            idPropriedade: Number(self.selectedPropriedade()),
            idTipoDeEntrada: Number(self.selectedTipoEntrada()),
            dataDeEntrada: new Date()
        }

        /*if (!validarCampos(self.quantidadeTotal(), 
        self.quantidadeVacinada(), self.selectedEspecie(), 
        self.selectedPropriedade(), self.selectedTipoEntrada())) return console.log('campos invalidos')*/

        /*const validacaoQuantidade = validarQuantidades(animalDto.quantidadeTotal, animalDto.quantidadeVacinada)
        if (!validacaoQuantidade.valido) return alert(validacaoQuantidade.msg)*/

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
            error: error => console.log(error.responseText)
        }).then(() => {
            $.get(apiUrl, self.animais)
            alert('Entrada de animal cancelada')
        }).catch(alert)
    }
}

ko.applyBindings(new appViewModel())