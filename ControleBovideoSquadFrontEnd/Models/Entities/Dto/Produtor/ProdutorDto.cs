namespace ControleBovideoSquad.CrossCutting.Dto.Produtor
{
    public class ProdutorDto
    {
        public virtual int IdProdutor { get; set; }
        public virtual string Nome { get; set; }
        public virtual string CPF { get; set; }
        public virtual int? IdEndereco { get; set; }
        public virtual string Rua { get; set; }
        public virtual string Numero { get; set; }
        public virtual string Municipio { get; set; }
        public virtual int IdMunicipio { get; set; }
        public virtual string Estado { get; set; }

        public ProdutorDto(int idProdutor, string nome, string cPF, int? idEndereco, string rua, string numero, string municipio, int idMunicipio, string estado)
        {
            IdProdutor = idProdutor;
            Nome = nome;
            CPF = cPF;
            IdEndereco = idEndereco;
            Rua = rua;
            Numero = numero;
            Municipio = municipio;
            IdMunicipio = idMunicipio;
            Estado = estado;
        }
    }
}
