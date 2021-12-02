namespace ControleBovideoSquad.CrossCutting.Dto.AnimaisDto
{
    public class RebanhoDto
    {
        public virtual int IdRebanho { get; set; }
        public virtual int QuantidadeTotal { get; set; }
        public virtual int QuantidadeVacinadaAftosa { get; set; }
        public virtual int QuantidadeVacinadaBrucelose { get; set; }
        public virtual int IdEspecie { get; set; }
        public virtual int IdPropriedade { get; set; }

        public RebanhoDto(int idRebanho, int quantidadeTotal, int quantidadeVacinadaAftosa, int quantidadeVacinadaBrucelose, int idEspecie, int idPropriedade)
        {
            IdRebanho = idRebanho;
            QuantidadeTotal = quantidadeTotal;
            QuantidadeVacinadaAftosa = quantidadeVacinadaAftosa;
            QuantidadeVacinadaBrucelose = quantidadeVacinadaBrucelose;
            IdEspecie = idEspecie;
            IdPropriedade = idPropriedade;
        }

    }
}
