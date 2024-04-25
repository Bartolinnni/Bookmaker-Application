using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Bukmacher.Database.Models
{
    public class IndividualBet
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int MatchId { get; set; }
        public Match Match { get; set; }
        public int PredictedHomeTeamScore { get; set; }
        public int PredictedAwayTeamScore { get; set; }
        public int? Points { get; set; }
    }
}