const url = "https://localhost:7168/api/propriedade";
    var ViewPropriedade = function()
    {
        self = this;
        self.propriedades = ko.observableArray([]);
        self.rebanhos = ko.observableArray([]);
        self.municipios = ko.observable([]);

        Boolean:validarCpf = true;
        Boolean:validarCpfEditar = true;
        Boolean:validarInscricaoEstadual = true;
        Boolean:mostrar = true;

        GetPropriedades();
        getMunicipios();

        var Produtor;
        self.Municipio = ko.observable("");

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
        
        self.cpf.message = ko.observable("");
        self.inscricaoEstadual.message = ko.observable("");
        self.nome.message = ko.observable("");
        self.idMunicipio.message = ko.observable("");
        self.rua.message = ko.observable("");
        self.numero.message = ko.observable("");

        self.cpf.focused = ko.observable("");
        self.cpf.focused.subscribe(function(newValue) { 
            console.log("aqui" + validarCpf); 
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
        self.cpfEditar.focused = ko.observable("");
        self.cpfEditar.focused.subscribe(function(newValue) { 
            console.log("aqui" + validarCpf); 
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

        self.inscricaoEstadual.focused = ko.observable("");
        self.inscricaoEstadual.focused.subscribe(function(newValue) {  
            if(validarInscricaoEstadual){
                validarInscricaoEstadual = false;
                console.log("data");
            }else{
                if(inscricaoEstadual() == ""){
                    self.inscricaoEstadual.message("");
                    return;
                }
                self.inscricaoEstadual.message("teste");

                var urlFormatada = "https://localhost:7168/api/Propriedade/validainscricao/" + inscricaoEstadual();
                $.getJSON(urlFormatada, function(data) {
                    //cpfIdProdutor = data.idProdutor;
                    console.log(data);
                }).fail(function(error) {
                    console.log(error.responseText);

                    self.inscricaoEstadual.message(error.responseText);
                });
                
                validarInscricaoEstadual = true;
            }
        });

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
            console.log("teste");
        }

        self.getInscricao = function(){
            console.log(inscricaoEstadual());
            self.inscricaoEstadual.message("");
            if(inscricaoEstadual() == ""){
                return;
            }
            //cpf(data.cpf)
            GetPropriedade();
        }

        self.getPropriedadeDetalhe = function(data){
            getPropriedadeSelecionado(data);
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
            console.log(propriedadeSelect);
        };

        self.post = function ()
        {
            propriedadeAdd.idProdutor = Produtor.idProdutor;
            propriedadeAdd.nomeProdutor = Produtor.nome;
            propriedadeAdd.idMunicipio = Municipio().idMunicipio;
            propriedadeAdd.municipio = Municipio().nome;
            propriedadeAdd.estado = Municipio().estado;
            
            console.log(Municipio().idMunicipio);
            console.log(ko.toJSON(propriedadeAdd));
            $.ajax({
                type: "POST",
                url: url,
                data: ko.toJSON(propriedadeAdd),
                contentType: "application/json",
                success: function (data) {
                    alert("Registro incluído com sucesso");

                },
                error: function (error) {
                    console.log(error.responseJSON);
                }
          });
        }

        self.put = function ()
        {            
            console.log(ko.toJSON(propriedadeAdd));
            $.ajax({
                type: "PUT",
                url: url,
                data: ko.toJSON(propriedadeAdd),
                contentType: "application/json",
                success: function (data) {
                    alert("Registro incluído com sucesso");

                },
                error: function (error) {
                    console.log(error.responseJSON);
                }
          });
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
                console.log(Produtor);
            }).fail(function(error) {
                console.log(error);
                
                self.cpf.message(error.responseJSON.errors);
            });
        }
            

        function GetProdutorId(id)
        {
            var urlFormatada = "https://localhost:7168/api/produtor/" + id;
            $.getJSON(urlFormatada, function(data) {
                cpf(data.cpf);
                console.log(data.cpf);
            }).fail(function(error) {
                console.log(error);
                self.cpf.message(error.responseJSON.errors);
            });
        };

        function GetPropriedade()
        {
            $.getJSON(url + "/inscricao/" + inscricaoEstadual(), function(data) {
                self.propriedades(data);
            }).fail(function(error){
                alert(error.responseJSON.errors);
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
            $.getJSON("https://localhost:7168/api/rebanho/" + inscricaoEstadual() + "/Propriedade", function(data) {
                self.rebanhos(data);
                console.log(data);
            });
        };
    }
    ko.applyBindings(ViewPropriedade());