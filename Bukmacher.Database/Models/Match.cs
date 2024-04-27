using System.ComponentModel.DataAnnotations.Schema;

namespace Bukmacher.Database.Models
{
    public class Match
    {
        public int Id { get; set; }
        public int ExternalId { get; set; }
        public int AwayTeamId { get; set; }
        public Team AwayTeam { get; set; }
        public int HomeTeamId { get; set; }
        public Team HomeTeam { get; set; }
        public int? HomeTeamScore { get; set; }
        public int? AwayTeamScore { get; set; }
        public int? Status { get; set; }
        public DateTime? MatchDate { get; set; }
        public List<IndividualBet> IndividualBetsList { get; set; }
    }
}