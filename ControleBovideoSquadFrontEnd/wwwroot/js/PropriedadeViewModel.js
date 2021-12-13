const url = "https://localhost:7168/api/";

var ViewPropriedade = function()
{
    self = this;
    self.propriedades = ko.observableArray([]);
    self.rebanhos = ko.observableArray([]);
    self.municipios = ko.observable([]);
    self.registrosVacinas = ko.observable([]);

    validarCpf = true;
    validarInscricaoEstadual = true;
    validarCpfEditar = true;

    GetPropriedades();
    $.getJSON(url + "municipio", self.municipios);

    var Produtor;
    self.Municipio = ko.observable("");

    self.inscricaoEstadual = ko.observable("").extend({
        validation: {
            message: 'Campo obrigatório!',
            validator: value => value.length > 0
    }});
    self.nome = ko.observable("").extend({
        validation: {
            message: 'Campo obrigatório!',
            validator: value => value.length > 0
    }});
    self.rua = ko.observable("").extend({
        validation: {
            message: 'Campo obrigatório!',
            validator: value => value.length > 0
    }});
    self.numero = ko.observable("").extend({
        validation: {
            message: 'Deve ser maior ou igual a 1!',
            validator: value => Number(value) >= 1
    }});
    self.cpf = ko.observable("").extend({
        validation: {
            message: 'Campo obrigatório!',
            validator: value => {
                if(value.length == 0)
                    return false;
                return true;
    }}});
    self.idPropriedade = ko.observable("");
    self.idProdutor = ko.observable("");
    self.nomeProdutor = ko.observable("");
    self.idEndereco = ko.observable("");
    self.idMunicipio = ko.observable("");
    self.municipio = ko.observable("");
    self.estado = ko.observable("");

    self.cpfEditar = ko.observable("");
    self.inscricaoEstadualEditar = ko.observable("");
    self.inscricaoEstadualPesquisa = ko.observable("");
    
    self.cpf.message = ko.observable("");
    self.inscricaoEstadual.message = ko.observable("");
    self.cpfEditar.message = ko.observable("");
    self.inscricaoEstadualEditar.message = ko.observable("");

    self.cpf.focused = ko.observable("");
    self.cpfEditar.focused = ko.observable("");
    self.inscricaoEstadual.focused = ko.observable("");

    var propriedadeAdd = {
        idPropriedade: self.idPropriedade,
        inscricaoEstadual: self.inscricaoEstadual,
        nome: self.nome,
        idProdutor: self.idProdutor,
        nomeProdutor: self.nomeProdutor,
        idEndereco: self.idEndereco,
        rua: self.rua,
        numero: self.numero,
        idMunicipio: self.idMunicipio,
        municipio: self.municipio,
        estado: self.estado
    };

    self.cpf.focused.subscribe(function(newValue) { 
        if(validarCpf){
            validarCpf = false;
        }else{
            self.cpf.message("");
            if(cpf() == ""){
                return;
            }
            $.getJSON(url + "produtor/cpf/" + ApenasNumeros(cpf()), function(data) {
                Produtor = data;
            }).fail(function(error) {                
                self.cpf.message(error.responseJSON);
            });
            validarCpf = true;
        }
    });

    function ApenasNumeros(string){
        return string.replace(/[^0-9]/g,'');
    }

    self.cpfEditar.focused.subscribe(function(newValue) { 
        if(validarCpfEditar){
            validarCpfEditar = false;
        }else{
            self.cpf.message("");
            if(cpf() == ""){
                return;
            }
            $.getJSON(url + "produtor/cpf/" + ApenasNumeros(cpf()), function(data) {
                Produtor = data;
            }).fail(function(error) {                
                self.cpfEditar.message(error.responseJSON);
            });
            validarCpfEditar = true;
        }
    });

    self.inscricaoEstadual.focused.subscribe(function(newValue) {  
        if(validarInscricaoEstadual){
            validarInscricaoEstadual = false;
        }else{
            self.inscricaoEstadual.message("");
            if(inscricaoEstadual() == ""){
                return;
            }
            $.getJSON(url + "propriedade/validainscricao/" + ApenasNumeros(inscricaoEstadual()), function(data) {
            }).fail(function(error) {
                self.inscricaoEstadual.message(error.responseJSON);
        });
            validarInscricaoEstadual = true;
        }
    });

    self.limpaCampo = function(){
        self.idPropriedade("");
        self.cpf("");
        self.inscricaoEstadual("");
        self.nome("");
        self.idProdutor("");
        self.nomeProdutor("");
        self.idEndereco("");
        self.rua("");
        self.numero("");
        self.idMunicipio("");
        self.municipio("");
        self.estado("");
    }

    self.getInscricao = function(){
        console.log(inscricaoEstadualPesquisa());
        if(inscricaoEstadualPesquisa() == ""){
            GetPropriedades();
            return;
        }
        GetPropriedade();
    }

    self.getPropriedadeDetalhe = function(data){
        getPropriedadeSelecionado(data);
        GetRegistroVacinas();
    }

    self.getPropriedadeEditar = function(data){
        GetProdutorId(data.idProdutor);
        getPropriedadeSelecionado(data);
    }

    self.getPropriedadeSelecionado = function(propriedadeSelect){
        self.idPropriedade(Number(propriedadeSelect.idPropriedade));
        self.inscricaoEstadual(propriedadeSelect.inscricaoEstadual);
        self.nome(propriedadeSelect.nome);
        self.idProdutor(propriedadeSelect.idProdutor);
        self.nomeProdutor(propriedadeSelect.nomeProdutor);
        self.idEndereco(propriedadeSelect.idEndereco);
        self.rua(propriedadeSelect.rua);
        self.numero(propriedadeSelect.numero);
        self.idMunicipio(propriedadeSelect.idMunicipio);
        self.municipio(propriedadeSelect.municipio);
        self.estado(propriedadeSelect.estado);
        GetRebanhos();
    };

    self.post = function (){
        let errors = ko.validation.group(this)
        if (errors().length > 0) return errors.showAllMessages()
        if(cpf.message() != "") return
        if(inscricaoEstadual.message() != "") return

        propriedadeAdd.idProdutor = Produtor.idProdutor;
        propriedadeAdd.nomeProdutor = Produtor.nome;
        propriedadeAdd.idPropriedade = 0;
        propriedadeAdd.idEndereco = 0;
        propriedadeAdd.idMunicipio = Municipio().idMunicipio;
        propriedadeAdd.municipio = Municipio().nome;
        propriedadeAdd.estado = Municipio().estado;
        
        $.ajax({
            type: "POST",
            url: url + "propriedade",
            data: ko.toJSON(propriedadeAdd),
            contentType: "application/json",
            success: function (data) {
                $('.modal').modal('hide');
                GetPropriedades();
                MostrarSucesso("Propriedade adicionada!")
            },
            error: function (error) {
                MostrarErro(error.responseJSON)
            }
        });
    }

    self.put = function (){            
        if(cpfEditar.message() != "") return
        if(inscricaoEstadualEditarEstadual.message() != "") return
        $.ajax({
            type: "PUT",
            url: url + "propriedade",
            data: ko.toJSON(propriedadeAdd),
            contentType: "application/json",
            success: function (data) {
                $('.modal').modal('hide');
                GetPropriedades();
                MostrarSucesso("Propriedade adicionada!")

            },
            error: function (error) {
                MostrarErro(error.responseJSON)
                alert(error.responseJSON);
            }
        });   
    }

        
    function GetPropriedades() { $.getJSON(url + "propriedade", self.propriedades);}

    function GetProdutorId(id)
    {
        $.getJSON(url + "produtor/" + id, function(data) {
            cpf(data.cpf);
        }).fail(function(error) {
            self.cpf.message(error.responseJSON);
        });
    };

    function GetPropriedade()
    {
        if(ApenasNumeros(inscricaoEstadualPesquisa()) != "")
            $.getJSON(url + "propriedade/inscricao/" + ApenasNumeros(inscricaoEstadualPesquisa()), function(data) {
                self.propriedades(data);
            }).fail(function(error){
                MostrarErro(error.responseJSON)
            });
        else
            MostrarErro("Inscrição Estadual inválida!")
    } 

    function GetRebanhos()
    {
        $.getJSON(url + "rebanho/Propriedade/" + inscricaoEstadual(), function(data) {
            self.rebanhos(data);
            if(rebanhos().length > 0){
                $('#rebanho').show();
            }else{
                $('#rebanho').hide();
            }
        });
    };

    function GetRegistroVacinas()
    {
        $.getJSON(url + "registrovacina/" + inscricaoEstadual(), function(data) {
            data.forEach(function (value) {
                value.dataDaVacina = formatarData(value.dataDaVacina);
            });
            self.registrosVacinas(data);
            if(registrosVacinas().length > 0)
                $('#registroVacina').show();
            else
                $('#registroVacina').hide();
        });
    };

    function formatarData(data){
        var date = new Date(data),
        dia  = date.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (date.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = date.getFullYear();
        return diaF+"/"+mesF+"/"+anoF;
    }
}
ko.applyBindings(ViewPropriedade());