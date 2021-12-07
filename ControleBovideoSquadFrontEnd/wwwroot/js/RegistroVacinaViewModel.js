var RegistroVacinaViewModel = function () {
    var self = this;

    self.registrovacinas = ko.observableArray([]);
    self.produtores = ko.observableArray([]);
    self.propriedades = ko.observableArray([]);
    self.rebanho = ko.observableArray([]);
    self.vacinas = ko.observableArray([]);

    self.selectedProdutor = ko.observable();
    self.selectedPropriedade = ko.observable();

    self.idRegistroVacinacao = ko.observable();
    self.idVacina = ko.observable();
    self.vacina = ko.observable();
    self.especie = ko.observable();
    self.idRebanho = ko.observable();
    self.quantidade = ko.observable();
    self.dataDaVacina = ko.observable();

    GetProdutores();
    GetVacinas();

    var registrovacina = {
        idVacina: self.idVacina,
        idRebanho: self.idRebanho,
        quantidade: self.quantidade,
        dataDaVacina: self.dataDaVacina,
    }

    self.selectedProdutor.subscribe(function (value) {
        if (value != undefined)
            GetPropriedades(value);
        else
            self.propriedades([])
    }, this)

    self.selectedPropriedade.subscribe(function (value) {
        if (value != undefined) {
            GetRebanho(value)
            GetRegistroVacina(value)
            document.getElementById("buttonAdicionar").disabled = false;
        }
        else {
            self.registrovacinas([])
            document.getElementById("buttonAdicionar").disabled = true;
        }

        console.log(value);
    })

    self.getRegistroSelecionado = function (_registro) {
        self.idRegistroVacinacao(_registro.idRegistroVacina);
        self.idVacina(_registro.idVacina);
        self.idRebanho(_registro.idRebanho);
        self.quantidade(_registro.quantidade);
        self.dataDaVacina(_registro.dataDaVacina);
        self.vacina(_registro.vacina);
        self.especie(_registro.especie);
    }

    self.clearLabels = function (_registro) {
        self.idRegistroVacinacao(0);
        self.idVacina("");
        self.idRebanho("");
        self.quantidade("");
        self.dataDaVacina("");
        self.vacina("");
        self.especie("");
    }

    function GetRegistroVacina(propriedadeInscricao) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/RegistroVacina/${propriedadeInscricao}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                data.forEach(function (value) {
                    value.dataDaVacina = AlterDateFormat(value.dataDaVacina);
                })

                self.registrovacinas(data);
                console.log(self.registrovacinas())
            },
            error: function (error) {
                alert("Erro");
            }
        })
    }

    self.cancelarRegistroVacina = () => {
        $.ajax({
            type: "delete",
            url: `https://localhost:7168/api/RegistroVacina/${self.idRegistroVacinacao()}`,
            success: function () {
                alert("Registro cancelado com sucesso")
                console.log(self.selectedPropriedade())
                GetRegistroVacina(self.selectedPropriedade());
            },
            error: function (error) {
                console.log(error)
                alert("Erro");
            }
        })
    }

    function GetProdutores() {
        $.ajax({
            type: "GET",
            url: "https://localhost:7168/api/Produtor",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.produtores(data);
                console.log(self.produtores())
            },
            error: function (error) {
                alert("Erro");
            }
        });
    }

    function GetVacinas() {
        $.ajax({
            type: "GET",
            url: "https://localhost:7168/api/Vacina",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.vacinas(data);
                console.log(self.vacinas());
            },
            error: function (error) {
                alert("Erro");
            }
        })
    }
    self.Save = () => {
        $.ajax({
            type: "POST",
            url: "https://localhost:7168/api/RegistroVacina",
            data: ko.toJSON(registrovacina),
            contentType: "application/json",
            success: function (data) {
                alert("Registro incluído com sucesso");
                console.log(self.selectedPropriedade())
                GetRegistroVacina(self.selectedPropriedade());
                $('#adicionarRegistroVacina').modal('hide')
            },
            error: function (error) {
                alert(error.responseJSON);
            }
        })
        console.log(ko.toJSON(registrovacina));
    }

    self.GetPropriedades = function (produtorID) {
        console.log(produtorID)
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Propriedade/${produtorID}/Produtor`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.propriedades(data);
            },
            error: function (error) {
                alert("Erro");
            }
        })
    }

    self.GetRebanho = function (propriedadeInscricao) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Rebanho/${propriedadeInscricao}/Propriedade`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.rebanho(data);
                console.log(self.rebanho())
                console.log(data.forEach(function (value) {
                    console.log(value.especie.nome)
                }));
            },
            error: function (error) {
                alert("Erro");
            }
        })
    }

    function AlterDateFormat(value) {
        var dd = value.slice(8, 10);
        var mm = value.slice(5, 7);
        var yyyy = value.slice(0, 4);

        return String(dd + "/" + mm + "/" + yyyy)
    }

}

ko.applyBindings(RegistroVacinaViewModel)