var RegistroVacinaViewModel = function () {
    var self = this;

    self.registrovacinas = ko.observableArray([]);
    self.produtores = ko.observableArray([]);
    self.propriedades = ko.observableArray([]);
    self.rebanho = ko.observableArray([]);
    self.vacinas = ko.observableArray([]);

    GetProdutores();
    GetVacinas();

    self.selectedProdutor = ko.observable();
    self.selectedPropriedade = ko.observable();

    self.idRegistroVacinacao = ko.observable();
    self.idVacina = ko.observable();
    self.vacina = ko.observable();
    self.especie = ko.observable();
    self.idRebanho = ko.observable();
    self.quantidade = ko.observable();
    self.dataDaVacina = ko.observable();

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
            document.getElementById('table-content').style.opacity = '1'            
        }
        else {
            document.getElementById("buttonAdicionar").disabled = true;
            ZerarArrayRegistroVacina()
        }
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

    function ZerarArrayRegistroVacina(){
        self.registrovacinas([]) 
        document.getElementById('table-content').style.opacity = '0'
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
            },
            error: error => {           
                ZerarArrayRegistroVacina()
            }
        })
    }

    self.cancelarRegistroVacina = () => {
        $.ajax({
            type: "delete",
            url: `https://localhost:7168/api/RegistroVacina/${self.idRegistroVacinacao()}`,
            success: function () {
                MostrarSucesso("Registro cancelado com sucesso")                                
                GetRegistroVacina(self.selectedPropriedade());
            },
            error: error => MostrarErro(error.responseJSON[0])
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
            error: () =>  MostrarErro("Alguma coisa deu errado, contate o admnistrador!")
        });
    }

    function GetVacinas() {
        $.ajax({
            type: "GET",
            url: "https://localhost:7168/api/Vacina",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: self.vacinas,
            error: () => MostrarErro("Alguma coisa deu errado, contate o admnistrador!")
        })
    }
    self.Save = () => {
        $.ajax({
            type: "POST",
            url: "https://localhost:7168/api/RegistroVacina",
            data: ko.toJSON(registrovacina),
            contentType: "application/json",
            success: function (data) {                
                console.log(self.selectedPropriedade())
                GetRegistroVacina(self.selectedPropriedade());
                $('#adicionarRegistroVacina').modal('hide')
                MostrarSucesso("Registro incluido com sucesso");
            },
            error: error => MostrarErro(error.responseJSON[0])            
        })        
    }

    self.GetPropriedades = function (produtorID) {
        console.log(produtorID)
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Propriedade/Produtor/${produtorID}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.propriedades(data);
            },
            error: () => {
                self.propriedades([])
                MostrarErro("Nenhuma propriedade foi encontrada para esse produtor!")
            }            
        })
    }

    self.GetRebanho = function (propriedadeInscricao) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Rebanho/Propriedade/${propriedadeInscricao}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.rebanho(data);  
                document.getElementById("buttonAdicionar").disabled = false;                           
            },
            error: () =>{ 
                self.rebanho([])
                document.getElementById("buttonAdicionar").disabled = true;
                MostrarErro("Nenhum rebanho disponivel para ser vacinado!") 
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