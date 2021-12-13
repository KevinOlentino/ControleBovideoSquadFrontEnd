function mascara(i) {
    var v = i.value;

    if (isNaN(v[v.length - 1])) {
        i.value = v.substring(0, v.length - 1);
        return;
    }
    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";
}

//document.getElementById("findByCPF").addEventListener('paste', e => e.preventDefault());

var ProdutorViewModel = function () {
    var self = this;

    self.produtores = ko.observableArray([]);
    self.municipios = ko.observableArray([]);
    self.propriedades = ko.observableArray([]);
    self.rebanhos = ko.observableArray([]);
    self.municipioEdit = ko.observableArray([]);
    self.vendasDoProdutor = ko.observableArray([]);

    GetProdutores();
    GetMunicipios();

    self.idProdutor = ko.observable("0");
    self.nome = ko.observable("");
    self.cpf = ko.observable("");
    self.idEndereco = ko.observable("");
    self.rua = ko.observable("");
    self.numero = ko.observable("");
    self.municipio = ko.observable("");
    self.estado = ko.observable("");
    self.idMunicipio = ko.observable();
    self.findCPF = ko.observable("");

    self.clearLabels = function () {
        self.idProdutor("0");
        self.nome("");
        self.cpf("");
        self.idEndereco("0");
        self.rua("");
        self.numero("");
        self.municipio("");
        self.idMunicipio("");
    }

    self.DetalharProdutor = function (value) {        
        getRebanhos(value.cpf);
        getPropriedades(value.idProdutor)
        self.getVendasDoProdutor(value.cpf)
    }

    function getRebanhos(value) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Rebanho/Produtor/${value}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data) => {
                self.rebanhos(data);
                document.getElementById('tableRebanhos').style.display = ''           
            },
            error: () => {
                self.rebanhos([])
                document.getElementById('tableRebanhos').style.display = 'none'
        }
        });
    }

    function getPropriedades(value) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Propriedade/Produtor/${value}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data) => {
                self.propriedades(data)
                document.getElementById('tablePropriedades').style.display = ''
            },            
            error: () => {
                self.propriedades("")                                            
                document.getElementById('tablePropriedades').style.display = 'none'
            }
        });
    }

    var produtorDados = {
        idProdutor: self.idProdutor,
        nome: self.nome,
        cpf: self.cpf,
        idEndereco: self.idEndereco,
        rua: self.rua,
        numero: self.numero,
        municipio: self.municipio,
        idMunicipio: self.idMunicipio,
        estado: self.estado
    }

    function GetProdutores() {
        $.ajax({
            type: "GET",
            url: "https://localhost:7168/api/Produtor",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                data.forEach(function (value) {
                    FormatarCPF(value);
                })
                self.produtores(data);
            },
            error: error => MostrarErro(error.responseJSON)
        });
    }

    self.GetProdutor = function () {  
       
        var cpf = self.findCPF().replace(/[^0-9]/g,'');
                
        if (cpf.length < 11 || !cpf) return MostrarErro("Insira um CPF Valido!")        

        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Produtor/cpf/${self.findCPF()}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                FormatarCPF(data)
                self.getprodutorselecionado(data);
                getPropriedades(data.idProdutor)
                getRebanhos(data.cpf)
                $("#showDetails").modal('show')
            },
            error: () => MostrarErro("Produtor não encontrado!")                         
        })
    }

    function FormatarCPF(value) {
        value.cpf = value.cpf.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/, "-");
    }

    self.Save = function () {
        $.ajax({
            type: "POST",
            url: "https://localhost:7168/api/Produtor",
            data: ko.toJSON(produtorDados),
            contentType: "application/json",
            success: function (data) {                
                GetProdutores();
                $('#adicionarProdutor').modal('hide')
                MostrarSucesso("Registro incluído com sucesso");
            },
            error: error => MostrarMensagem(error.responseJSON[0])            
        })        
    }

    function GetMunicipios() {
        $.ajax({
            type: "GET",
            url: "https://localhost:7168/api/Municipio",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.municipios(data);
                self.municipioEdit(data);
                console.log(municipioEdit());
            },
            error: () => MostrarErro("Algo deu errado, contate o admnistrador!")
        });
    }
    
    self.update = function () {
        var url = "https://localhost:7168/api/Produtor/" + self.idProdutor();
        $.ajax({
            type: "PUT",
            url: url,
            data: ko.toJSON(produtorDados),
            contentType: "application/json",
            success: function () {                
                GetProdutores();                               
                var data = ko.toJS(produtorDados);
                data.municipio = (self.municipios()[produtorDados.idMunicipio()-1].nome);            
                getprodutorselecionado(data)                
                $('#editarProdutor').modal('hide')
                MostrarSucesso("Registro atualizado com sucesso!");
            },
            error: error => MostrarErro(error.responseJSON[0])            
        })       
    }

    self.getprodutorselecionado = function (_produtor) {        
        self.idProdutor(_produtor.idProdutor);
        self.nome(_produtor.nome);
        self.cpf(_produtor.cpf);
        self.idEndereco(_produtor.idEndereco);
        self.rua(_produtor.rua);
        self.numero(_produtor.numero);
        self.municipio(_produtor.municipio)
        self.estado(_produtor.estado)
        self.idMunicipio(_produtor.idMunicipio)
    }

    self.getVendasDoProdutor = (cpfProdutor) => {
        $.ajax({
            type: "GET",
            url: `https://localhost:7168/api/Venda/produtor/${cpfProdutor}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: data => {
                self.vendasDoProdutor(data)
                document.getElementById('tableVendas').style.display = ''
            },
            error:() => {
                self.vendasDoProdutor([])
                document.getElementById('tableVendas').style.display = 'none'
        }
        })
    }
}

ko.applyBindings(ProdutorViewModel());