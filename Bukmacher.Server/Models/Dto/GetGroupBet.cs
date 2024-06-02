namespace Bukmacher.Server.Models.Dto
{
    public class GetGroupBet
    {
        public class AwayTeam
        {
            public int Id { get; set; }
            public int ExternalId { get; set; }
            public string Name { get; set; }
            public string Logo { get; set; }
        }

        public class HomeTeam
        {
            public int Id { get; set; }
            public int ExternalId { get; set; }
            public string Name { get; set; }
            public string Logo { get; set; }
        }

        public class IndividualBetsList
        {
            public int Id { get; set; }
            public string UserId { get; set; }
            public int MatchId { get; set; }
            public int PredictedHomeTeamScore { get; set; }
            public int PredictedAwayTeamScore { get; set; }
            public int Points { get; set; }
        }

        public class Match
        {
            public int Id { get; set; }
            public int ExternalId { get; set; }
            public int AwayTeamId { get; set; }
            public AwayTeam AwayTeam { get; set; }
            public int HomeTeamId { get; set; }
            public HomeTeam HomeTeam { get; set; }
            public int? HomeTeamScore { get; set; }
            public int? AwayTeamScore { get; set; }
            public int? Status { get; set; }
        }

        public class Root
        {
            public int Id { get; set; }
            public string UserId { get; set; }
            public string UserName { get; set; }
            public int MatchId { get; set; }
            public int GroupId { get; set; }
            public Match Match { get; set; }
            public int PredictedHomeTeamScore { get; set; }
            public int PredictedAwayTeamScore { get; set; }
            public DateTime? PointDate { get; set; }
            public int? Points { get; set; }
        }
    }
}