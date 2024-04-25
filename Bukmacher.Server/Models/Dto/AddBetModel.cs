namespace Bukmacher.Server.Models.Dto;

public class AddBetModel
{
    public string userName { get; set; } 
    public Game Game { get; set; }
    public int homeScore { get; set; }
    public int awayScore { get; set; }
}