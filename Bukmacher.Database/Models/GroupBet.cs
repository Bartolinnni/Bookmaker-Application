namespace Bukmacher.Database.Models;

public class GroupBet
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public Group Group { get; set; }
    public int MatchId { get; set; }
    public Match Match { get; set; }
    public string UserId { get; set; }
    public int PredictedHomeTeamScore { get; set; }
    public int PredictedAwayTeamScore { get; set; }
    public DateTime? PointDate { get; set; }
    public int? Points { get; set; }
}