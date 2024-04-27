namespace Bukmacher.Server.Models.Dto;

public class GetBetsStatistics
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public int? Points { get; set; }
    public DateTime? PointDate { get; set; }
}