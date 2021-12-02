namespace ControleBovideoSquad.CrossCutting.Dto.RegistroVacina
{
    public class RegistroVacinaDto
    {
        public int IdRegistroVacina { get; set; }
        public int Quantidade { get; set; }
        public int IdVacina { get; set; }
        public string? Vacina { get; set; }
        public int IdRebanho { get; set; }
        public string? Especie { get; set; }
        public DateTime DataDaVacina { get; set; }

        public RegistroVacinaDto(int idRegistroVacina, int quantidade, int idVacina, string vacina, int idRebanho, string especie, DateTime dataDaVacina)
        {
            IdRegistroVacina = idRegistroVacina;
            Quantidade = quantidade;
            IdVacina = idVacina;
            Vacina = vacina;
            Especie = especie;
            IdRebanho = idRebanho;
            DataDaVacina = dataDaVacina;
        }
    }
}
