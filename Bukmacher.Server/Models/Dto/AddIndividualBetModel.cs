namespace Bukmacher.Server.Models.Dto;

public class AddIndividualBetModel
{
    public string userName { get; set; } 
    public Game Game { get; set; }
    public int homeScore { get; set; }
    public int awayScore { get; set; }
}