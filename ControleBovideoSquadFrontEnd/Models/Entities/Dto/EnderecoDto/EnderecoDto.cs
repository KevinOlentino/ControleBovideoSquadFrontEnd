namespace ControleBovideoSquad.CrossCutting.Dto.EnderecoDto
{
    public class EnderecoDto
    {
        public int IdEndereco { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public int IdMunicipio { get; set; }

        public EnderecoDto(int idEndereco, string rua, string numero, int idMunicipio)
        {
            IdEndereco = idEndereco;
            Rua = rua;
            Numero = numero;
            IdMunicipio = idMunicipio;
        }

    }
}
