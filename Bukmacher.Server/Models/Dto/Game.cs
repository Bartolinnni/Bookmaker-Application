using System.Text.Json.Serialization;

namespace Bukmacher.Server.Models.Dto;

public class Game
{
    [JsonPropertyName("game_id")]
    public int GameId { get; set; }
    [JsonPropertyName("team_home_id")]
    public int TeamHomeId { get; set; }
    [JsonPropertyName("team_away_id")]
    public int TeamAwayId { get; set; }
    [JsonPropertyName("team_home_name")]
    public string TeamHomeName { get; set; }
    [JsonPropertyName("team_away_name")]
    public string TeamAwayName { get; set; }
    [JsonPropertyName("team_home_logo")]
    public string TeamHomeLogo { get; set; }
    [JsonPropertyName("team_away_logo")]
    public string TeamAwayLogo { get; set; }
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }
}