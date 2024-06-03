namespace Bukmacher.Server.Models.Dto;

public class UpdateBet
{
    public int Id { get; set; }
    public int PredictedHomeTeamScore { get; set; }
    public int PredictedAwayTeamScore { get; set; }
}