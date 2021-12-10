const url = "https://localhost:7168/api/propriedade";
    var ViewPropriedade = function()
    {
        self = this;
        //Arrays
        self.propriedades = ko.observableArray([]);
        self.rebanhos = ko.observableArray([]);
        self.municipios = ko.observable([]);
        self.registrosVacinas = ko.observable([]);

        //Valida CPF e IE
        Boolean:validarCpf = true;
        Boolean:validarCpfEditar = true;
        Boolean:validarInscricaoEstadual = true;
        Boolean:validarInscricaoEstadualEditar = true;

        GetPropriedades();
        getMunicipios();

        var Produtor;
        self.Municipio = ko.observable("");

        //Dados propriedade
        self.idPropriedade = ko.observable("");
        self.inscricaoEstadual = ko.observable("");
        self.nome = ko.observable("");
        self.idProdutor = ko.observable("");
        self.nomeProdutor = ko.observable("");
        self.idEndereco = ko.observable("");
        self.rua = ko.observable("");
        self.numero = ko.observable("");
        self.idMunicipio = ko.observable("");
        self.municipio = ko.observable("");
        self.estado = ko.observable("");
        self.cpf = ko.observable("");

        self.cpfEditar = ko.observable("");
        self.inscricaoEstadualEditar = ko.observable("");
        self.inscricaoEstadualPesquisa = ko.observable("");
        
        self.cpf.message = ko.observable("");
        self.inscricaoEstadual.message = ko.observable("");
        self.nome.message = ko.observable("");
        self.idMunicipio.message = ko.observable("");
        self.rua.message = ko.observable("");
        self.numero.message = ko.observable("");

        self.cpf.focused = ko.observable("");
        self.cpfEditar.focused = ko.observable("");
        self.inscricaoEstadual.focused = ko.observable("");
        self.inscricaoEstadualEditar.focused = ko.observable("");

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
                if(cpf() == ""){
                    self.cpf.message("");
                    return;
                }
                GetCpf();
                validarCpf = true;
            }
        });

        self.cpfEditar.focused.subscribe(function(newValue) { 
            if(validarCpfEditar){
                validarCpfEditar = false;
            }else{
                if(cpf() == ""){
                    self.cpf.message("");
                    return;
                }
                GetCpf();
                validarCpfEditar = true;
            }
        });

        self.inscricaoEstadual.focused.subscribe(function(newValue) {  
            if(validarInscricaoEstadual){
                validarInscricaoEstadual = false;
            }else{
                if(inscricaoEstadual() == ""){
                    self.inscricaoEstadual.message("");
                    return;
                }
                GetInscricao();
                validarInscricaoEstadual = true;
            }
        });

        self.inscricaoEstadualEditar.focused.subscribe(function(newValue) {  
            if(validarInscricaoEstadualEditar){
                validarInscricaoEstadualEditar = false;
            }else{
                if(inscricaoEstadual() == ""){
                    self.inscricaoEstadualEditar.message("");
                    return;
                }
                GetInscricao();
                validarInscricaoEstadualEditar = true;
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

        self.post = function ()
        {
            propriedadeAdd.idProdutor = Produtor.idProdutor;
            propriedadeAdd.nomeProdutor = Produtor.nome;
            propriedadeAdd.idPropriedade = 0;
            propriedadeAdd.idEndereco = 0;
            propriedadeAdd.idMunicipio = Municipio().idMunicipio;
            propriedadeAdd.municipio = Municipio().nome;
            propriedadeAdd.estado = Municipio().estado;

            if(ValidarForm()){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: ko.toJSON(propriedadeAdd),
                    contentType: "application/json",
                    success: function (data) {
                        $('.modal').modal('hide');
                        GetPropriedades();
                    },
                    error: function (error) {
                        alert(error.responseJSON);
                    }
              });
            }
        }

        self.put = function ()
        {            
            if(ValidarForm()){
                $.ajax({
                    type: "PUT",
                    url: url,
                    data: ko.toJSON(propriedadeAdd),
                    contentType: "application/json",
                    success: function (data) {
                        $('.modal').modal('hide');
                        GetPropriedades();
                    },
                    error: function (error) {
                        alert(error.responseJSON);
                    }
              });
            }
        }

        function ValidarForm(){
            self.nome.message("");
            self.idMunicipio.message("");
            self.rua.message("");
            self.numero.message("");
            
            var valida = true

            if(nome() == "" ){
                self.nome.message("Campo obrigatório!");
                valida = false
            }
            if(cpf() == "" || cpf.message() != ""){
                self.cpf.message("Campo obrigatório!");
                valida = false
            }
            if(inscricaoEstadual() == ""){
                self.inscricaoEstadual.message("Campo obrigatório!");
                valida = false
            }
            if(inscricaoEstadual.message() != ""){
                valida = false
            }
            if(idMunicipio() == null){
                self.idMunicipio.message("Campo obrigatório!");
                valida = false
            }
            if(rua() == ""){
                self.rua.message("Campo obrigatório!");
                valida = false
            }
            if(numero() == ""){
                self.numero.message("Campo obrigatório!");
                valida = false
            }
            if(parseInt(numero(), 10) < 1){
                self.numero.message("Numero deve ser maior que um!");
                valida = false
            }
            return valida;
        }

        function getMunicipios()
        {
            $.getJSON("https://localhost:7168/api/municipio", function(data) {
                self.municipios(data);
            });
        }

        function GetCpf()
        {
            var urlFormatada = "https://localhost:7168/api/produtor/cpf/" + cpf();
            $.getJSON(urlFormatada, function(data) {
                Produtor = data;
            }).fail(function(error) {                
                self.cpf.message(error.responseJSON);
            });
        }

        function GetInscricao(){
            var urlFormatada = "https://localhost:7168/api/Propriedade/validainscricao/" + inscricaoEstadual();
                $.getJSON(urlFormatada, function(data) {
                }).fail(function(error) {
                    self.inscricaoEstadualEditar.message(error.responseText);
            });
        }
            
        function GetProdutorId(id)
        {
            var urlFormatada = "https://localhost:7168/api/produtor/" + id;
            $.getJSON(urlFormatada, function(data) {
                cpf(data.cpf);
            }).fail(function(error) {
                self.cpf.message(error.responseJSON);
            });
        };

        function GetPropriedade()
        {
            $.getJSON(url + "/inscricao/" + inscricaoEstadualPesquisa(), function(data) {
                self.propriedades(data);
            }).fail(function(error){
                alert(error.responseJSON);
            });
        } 

        function GetPropriedades()
        {
            $.getJSON(url, function(data) {
                self.propriedades(data);
            });
        };

        function GetRebanhos()
        {
            $.getJSON("https://localhost:7168/api/rebanho/Propriedade/" + inscricaoEstadual(), function(data) {
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
            $.getJSON("https://localhost:7168/api/registrovacina/" + inscricaoEstadual(), function(data) {
                data.forEach(function (value) {
                    value.dataDaVacina = formatarData(value.dataDaVacina);
                });
            self.registrosVacinas(data);
            if(registrosVacinas().length > 0){
                $('#registroVacina').show();
            }else{
                $('#registroVacina').hide();
            }
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