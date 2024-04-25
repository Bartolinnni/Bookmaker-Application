namespace Bukmacher.Database.Models
{
    public class Team
    {
        public int Id { get; set; }
        public int ExternalId { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public List<Match>? HomeMatches { get; set; }
        public List<Match>? AwayMatches { get; set; }
    }
}