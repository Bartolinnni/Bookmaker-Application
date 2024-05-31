namespace Bukmacher.Server.Models.Dto;

public class AddGroupBetModel
{
    public string userName { get; set; } 
    public Game Game { get; set; }
    public int homeScore { get; set; }
    public int awayScore { get; set; }
    public List<int> groupsId { get; set; }
}