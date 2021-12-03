namespace ControleBovideoSquad.CrossCutting.Dto.Propriedade
{
    public class PropriedadeDto
    {
        public virtual int IdPropriedade { get; set; }
        public virtual string InscricaoEstadual { get; set; }
        public virtual string Nome { get; set; }
        public virtual int IdProdutor { get; set; }
        public virtual string NomeProdutor { get; set; }
        public virtual int? IdEndereco { get; set; }
        public virtual string Rua { get; set; }
        public virtual string Numero { get; set; }
        public virtual int IdMunicipio { get; set; }
        public virtual string Municipio { get; set; }
        public virtual string Estado { get; set; }

        public PropriedadeDto()
        {

        }
        public PropriedadeDto(int idPropriedade, string inscricaoEstadual, string nome, int idProdutor, string nomeProdutor, int? idEndereco, string rua, string numero, int idMunicipio, string municipio, string estado)
        {
            IdPropriedade = idPropriedade;
            InscricaoEstadual = inscricaoEstadual;
            Nome = nome;
            IdProdutor = idProdutor;
            NomeProdutor = nomeProdutor;
            IdEndereco = idEndereco;
            Rua = rua;
            Numero = numero;
            IdMunicipio = idMunicipio;
            Municipio = municipio;
            Estado = estado;
        }
    }
}
